require("../config/dotenv");

const config = {
	db: {
		dialect: "mysql",
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "",
		name: process.env.DB_NAME || "webcod",
		port: process.env.DB_PORT || 3306,
	},
};

const cliConfig = {
	development: {
		username: config.db.user,
		password: config.db.password,
		database: config.db.name,
		host: config.db.host,
		port: config.db.port,
		dialect: config.db.dialect,
		dialectOptions: {
			bigNumberStrings: true,
		},
	},
	test: {
		username: config.db.user,
		password: config.db.password,
		database: config.db.name,
		host: config.db.host,
		port: config.db.port,
		dialect: config.db.dialect,
		dialectOptions: {
			bigNumberStrings: true,
		},
	},
	production: {
		username: config.db.user,
		password: config.db.password,
		database: config.db.name,
		host: config.db.host,
		port: config.db.port,
		dialect: config.db.dialect,
		dialectOptions: {
			bigNumberStrings: true,
		},
	},
};

module.exports = cliConfig;
