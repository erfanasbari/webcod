require("../config/dotenv");

const config = {
	db: {
		dialect: "mysql",
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "",
		name: process.env.DB_NAME || "webcod",
	},
};

const cliConfig = {
	development: {
		username: config.db.user,
		password: config.db.password,
		database: config.db.name,
		host: config.db.host,
		port: 3306,
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
		port: 3306,
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
		port: 3306,
		dialect: config.db.dialect,
		dialectOptions: {
			bigNumberStrings: true,
			// ssl: {
			// 	ca: fs.readFileSync(__dirname + "/mysql-ca-master.crt"),
			// },
		},
	},
};

module.exports = cliConfig;
