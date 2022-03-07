module.exports = (sequelize, DataTypes) => {
	const game = sequelize.define(
		"game",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			category: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			brand: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			players_mini: {
				type: DataTypes.TINYINT,
				allowNull: true,
			},
			players_maxi: {
				type: DataTypes.TINYINT,
				allowNull: true,
			},
			inStock: {
				type: DataTypes.TINYINT,
				defaultValue: 1,
			},

			photo: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: true,
			updatedAt: "date",
			createdAt: false,
			defaultValue: DataTypes.NOW,
		}
	);
	return game;
};
