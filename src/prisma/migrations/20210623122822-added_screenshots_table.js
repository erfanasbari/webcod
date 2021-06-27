"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Creating session table

		await queryInterface.createTable("nehoscreenshotuploader_screenshots", {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			server_id: { type: Sequelize.INTEGER, allowNull: false },
			time_submitted: { type: Sequelize.DATE, allowNull: false },
			player_guid: { type: Sequelize.STRING(19), allowNull: false },
			player_name: { type: Sequelize.STRING(32), allowNull: false },
			map_name: { type: Sequelize.STRING(30), allowNull: false },
			screenshot_name: { type: Sequelize.STRING(128), allowNull: false },
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("nehoscreenshotuploader_screenshots");
	},
};
