const { member } = require("../models");
const jwt = require("jsonwebtoken"); // create token
const bcrypt = require("bcrypt"); // crypt password
const nodemailer = require("nodemailer");
const passwordValidator = require("password-validator");
const schemaPassword = new passwordValidator();
const { Op } = require("sequelize");

//* Schema Password
schemaPassword.is().min(8).has().uppercase().has().lowercase().has().digits();

//* Create a new member
exports.createMember = (req, res) => {
	const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let jeton = "";
	for (let i = 0; i < 25; i++) {
		jeton += characters[Math.floor(Math.random() * characters.length)];
	}
	const newMember = new member({
		...req.body,
		jeton: jeton,
		password: bcrypt.hashSync(req.body.password, 10),
	});
	newMember
		.save()
		.then((memb) => {
			let token = jwt.sign({ membId: memb.id, isAdmin: memb.isAdmin }, process.env.JWT_KEY, {
				expiresIn: "1h",
			});
			res.json({
				membId: memb.id,
				token: token,
				isAdmin: memb.isAdmin,
			});
		})
		.catch((err) => {
			res.status(401).send(err.errors[0].message);
		});
};

// * Login
exports.login = (req, res) => {
	const email_saisi = req.body.email;
	const password_saisi = req.body.password;
	member
		.findOne({
			where: {
				[Op.and]: [{ email: email_saisi }, { isAdmin: 1 }],
			},
		})
		.then((member) => {
			const password = member.password;
			if (bcrypt.compareSync(password_saisi, password)) {
				let token = jwt.sign(
					{ membId: member.id, isAdmin: member.isAdmin },
					process.env.JWT_KEY,
					{
						expiresIn: "1h",
					}
				);
				res.json({
					membId: member.id,
					token: token,
					isAdmin: member.isAdmin,
				});
			} else {
				res.status(401).send("Password not OK");
			}
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Get all members
exports.getAllMembers = (req, res) => {
	member.findAll({}).then((obj) => {
		res.send(obj);
	});
};

// * Modif password
exports.updatePassword = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send(schemaPassword.validate(req.body.password, { list: true }));
	} else {
		member
			.update(
				{
					password: bcrypt.hashSync(req.body.password, 10),
				},
				{ where: { jeton: req.params.jeton } }
			)
			.then(() => {
				res.send("password modified");
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

//* Update jeton (used for forgotten password)
exports.newjeton = (req, res) => {
	const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let jeton = "";
	for (let i = 0; i < 25; i++) {
		jeton += characters[Math.floor(Math.random() * characters.length)];
	}
	member
		.update(
			{
				jeton: jeton,
			},
			{ where: { email: req.params.email } }
		)
		.then(() => {
			res.send("volunteer's jeton modified !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Find member from his jeton
exports.jeton = (req, res) => {
	member
		.findOne({ where: { jeton: req.params.jeton } })
		.then((obj) => {
			res.status(200).send(obj);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Send an email for password forgotten
exports.emailPassword = (req, res) => {
	let transporter = nodemailer.createTransport({
		host: "source.o2switch.net",
		port: 465,
		// secure: true, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false,
		},
		auth: {
			user: process.env.FROM_EMAIL,
			pass: process.env.PASS_EMAIL,
		},
	});
	// Recherche  jeton
	member
		.findOne({
			where: {
				[Op.and]: [{ email: req.params.email }, { isAdmin: 1 }],
			},
		})
		.then((member) => {
			//! Modif link with https !
			const jeton = member.jeton;
			const email = req.params.email;
			const prenom = member.first_name;
			const nom = member.last_name;
			const titre = "[BJEA] Demande d'initialisation mot de passe";
			const message =
				"<p>Merci de cliquer sur le lien pour saisir un nouveau mot de passe.</p>";
			transporter.sendMail(
				{
					from: "BJEA <bjea@delmout.com>",
					to: email,
					subject: titre,
					html:
						"<p>Bonjour " +
						prenom +
						" " +
						nom +
						",</p></br>" +
						message +
						"</br><a href='http://cinema.noyant.delmout.com/setpassword/" +
						jeton +
						"'>Saisir un nouveau mot de passe</a></br></br><p>Merci de ne pas répondre à cet email.</p>",
				},
				(error, info) => {
					if (error) {
						return res.status(401).send(error);
					}
					res.status(200).send("email envoyé !");
				}
			);
		})
		.catch((err) => res.status(401).send(err));
};

// * Send an email to all members for specific information
exports.emailInfo = (req, res) => {
	let transporter = nodemailer.createTransport({
		host: "source.o2switch.net",
		port: 465,
		secure: true, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false,
		},
		auth: {
			user: process.env.FROM_EMAIL,
			pass: process.env.PASS_EMAIL,
		},
	});

	//! Mettre lien en https du site
	// List of members
	member
		.findAndCountAll()
		.then((members) => {
			const count = members.count;
			for (let i = 0; i < count; i++) {
				// Message for each member
				transporter.sendMail(
					{
						from: "BJEA <bjea@delmout.com>",
						to: members.rows[i].email,
						subject: "[BJEA] " + req.body.title,
						html:
							req.body.content +
							"<br/><a href='https://cinema.noyant.delmout.com'>Voir les permanences des bénévoles</a><br/><br/><p>Merci de ne pas répondre à cet email</p><p>L'administration de l'équipe Cinéma de Noyant</p>",
					},
					(error, info) => {
						if (error) {
							return res.status(401).send(error);
						}
						res.status(200).send("email envoyé à tous !");
					}
				);
			}
		})
		.catch((err) => res.status(401).send(err));
};

//* Update cotisation of member
exports.updateCotisation = (req, res) => {
	member
		.update(
			{
				cotisation: req.params.cotisation,
			},
			{ where: { id: req.params.memberid } }
		)
		.then(() => {
			res.send("cotisation has been updated !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Update caution of member
exports.updateCaution = (req, res) => {
	member
		.update(
			{
				caution: req.params.caution,
			},
			{ where: { id: req.params.memberid } }
		)
		.then(() => {
			res.send("caution has been updated !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
