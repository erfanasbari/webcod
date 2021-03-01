import { Sequelize } from "sequelize";
import config from "../config/configuration";

// Models
import serverModel from "./models/server";

const modelCreators = [serverModel];

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
	host: config.db.host,
	dialect: config.db.dialect,
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
