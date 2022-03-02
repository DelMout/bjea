module.exports = (sequelize, DataTypes) => {
	const member = sequelize.define(
		"member",
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
					notEmpty: true,
				},
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			cotisation: {
				type: DataTypes.TINYINT,
				defaultValue: 1,
			},
			caution: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			jeton: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			isAdmin: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			timestamps: false,
		}
	);
	return member;
};
