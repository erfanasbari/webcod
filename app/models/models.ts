import { Sequelize } from "sequelize";
import config from "../config/configuration";

const sequelize = new Sequelize(config.mySql.name, config.mySql.user, config.mySql.password, {
	host: config.mySql.host,
	dialect: "mysql",
	omitNull: true,
	define: {
		charset: "utf8",
		collate: "utf8_general_ci",
		timestamps: false,
	},
});

export default sequelize;
