const { member } = require("../models");
const jwt = require("jsonwebtoken"); // create token
const bcrypt = require("bcrypt"); // crypt password

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
