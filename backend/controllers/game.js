const { game } = require("../models");

//* Create a new game
exports.createGame = (req, res) => {
	const newGame = new game({
		...req.body,
	});
	newGame
		.save()
		.then(() => {
			res.status(200).send("New game created !");
		})
		.catch((err) => {
			res.status(401).send(err.errors[0].message);
		});
};
