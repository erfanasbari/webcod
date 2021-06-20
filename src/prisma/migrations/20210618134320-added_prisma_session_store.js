"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Creating session table
		await queryInterface.createTable("Session", {
			id: { type: Sequelize.STRING(255), primaryKey: true },
			sid: { type: Sequelize.STRING(255), unique: true, allowNull: false },
			data: { type: Sequelize.TEXT, allowNull: false },
			expiresAt: { type: Sequelize.DATE, allowNull: false },
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Session");
	},
};
