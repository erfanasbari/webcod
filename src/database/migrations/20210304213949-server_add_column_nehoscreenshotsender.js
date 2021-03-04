"use strict";

module.exports = {
	up: async (queryInterface, { DataTypes }) => {
		await queryInterface.addColumn(
			"servers",
			"nehoscreenshotsender",
			{
				type: DataTypes.JSON,
				defaultValue: JSON.stringify({
					enabled: false,
					identkey: "",
				}),
				allowNull: false,
			},
			{ after: "database" }
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("servers", "nehoscreenshotsender");
	},
};
