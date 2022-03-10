const { game } = require("../models");
const fs = require("fs-extra"); // handle files

//* Create a new game
exports.createGame = (req, res) => {
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
	} else {
		req.body.photo = null;
	}
	const newGame = new game({
		...req.body,
	});
	newGame
		.save()
		.then(() => {
			res.status(200).send("New game created !");
		})
		.catch((err) => {
			res.status(401).send(err);
			// res.status(401).send(err.errors[0].message);
		});
};

//* Modify a game (only name, category, brand, players, photo)
exports.modifyGame = (req, res) => {
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
		//delete the previous image file
		game.findOne({ where: { id: req.params.gameid } })
			.then((rep) => {
				if (rep.photo != null) {
					//if already photo
					const filename = rep.photo.split("/images/")[1];
					fs.unlink(`images/${filename}`, () => {
						game.update({ ...req.body }, { where: { id: req.params.gameid } })
							.then(() => {
								res.send("game and image file modified");
							})
							.catch((err) => {
								res.send(err);
							});
					});
				} else {
					game.update({ ...req.body }, { where: { id: req.params.gameid } })
						.then(() => {
							res.send("game modified and image file saved");
						})
						.catch((err) => {
							res.send(err);
						});
				}
			})
			.catch((err) => {
				res.status(401).send(err.errors[0].validatorKey);
			});
	} else {
		game.update(
			{
				...req.body,
			},
			{ where: { id: req.params.gameid } }
		)
			.then(() => {
				res.send("game modified !");
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

//* Out of stock of a game
exports.outOfStock = (req, res) => {
	game.update(
		{
			inStock: 0,
			date: Date(),
			memberId: req.params.memberid,
		},
		{ where: { id: req.params.gameid } }
	)
		.then(() => {
			res.send("game is now out of stock !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Into stock of a game
exports.intoStock = (req, res) => {
	game.update(
		{
			inStock: 1,
			date: Date(),
		},
		{ where: { id: req.params.gameid } }
	)
		.then(() => {
			res.send("game is now into stock !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Get all games
exports.getAllGames = (req, res) => {
	game.findAll({}).then((obj) => {
		res.send(obj);
	});
};
