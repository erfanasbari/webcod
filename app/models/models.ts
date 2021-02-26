import { Sequelize } from "sequelize";
import config from "../config/configuration";

// Models
import serverModel from "./server";

const modelCreators = [serverModel];

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

for (let i = 0; i < modelCreators.length; i++) {
	modelCreators[i](sequelize);
}

export default sequelize;
