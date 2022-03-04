const { category } = require("../models");

// * Get all members
exports.getAllCategories = (req, res) => {
	category.findAll({}).then((obj) => {
		res.send(obj);
	});
};
