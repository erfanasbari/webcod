"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Creating users table
		await queryInterface.createTable("users", {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			username: { type: Sequelize.STRING(128), unique: true, allowNull: false },
			password: { type: Sequelize.STRING(128), allowNull: false },
			email: { type: Sequelize.STRING(255), allowNull: false },
			role: { type: Sequelize.INTEGER(4), defaultValue: 0, allowNull: false },
		});

		// Creating servers table
		await queryInterface.createTable("servers", {
			id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
			type: { type: Sequelize.ENUM("CoD4x"), defaultValue: "CoD4x", allowNull: false },
			name: { type: Sequelize.STRING(255), unique: true, allowNull: false },
			ip: { type: Sequelize.STRING(15), defaultValue: "localhost", allowNull: false },
			port: { type: Sequelize.INTEGER(5), defaultValue: 28960, allowNull: false },
			rcon_password: { type: Sequelize.STRING(255), allowNull: false },
			db_enabled: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
			db_username: { type: Sequelize.STRING(255), allowNull: false },
			db_password: { type: Sequelize.STRING(255), allowNull: false },
			db_name: { type: Sequelize.STRING(255), allowNull: false },
		});

		// Creating server_options table
		await queryInterface.createTable("server_options", {
			server_id: { type: Sequelize.INTEGER, primaryKey: true },
			nehoscreenshotsender_enabled: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false },
			nehoscreenshotsender_identkey: { type: Sequelize.STRING(255), allowNull: false },
		});

		// Creating server_cache table
		await queryInterface.createTable("server_cache", {
			server_id: { type: Sequelize.INTEGER, primaryKey: true },
			name: { type: Sequelize.STRING(255), allowNull: false },
			rules: { type: Sequelize.STRING(255), allowNull: false },
			map: { type: Sequelize.STRING(32), allowNull: false },
			max_players: { type: Sequelize.INTEGER(4), allowNull: false },
			online_players: { type: Sequelize.INTEGER(4), allowNull: false },
			players_info: { type: Sequelize.TEXT("long"), allowNull: false },
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("users");
		await queryInterface.dropTable("servers");
		await queryInterface.dropTable("server_options");
		await queryInterface.dropTable("server_cache");
	},
};
