import { DataTypes, Sequelize } from "sequelize";

export default function createServerModel(sequelize: Sequelize) {
	const server = sequelize.define("server", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ip: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		port: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		server_type: {
			type: DataTypes.ENUM("CoD4x", "Minecraft"),
			allowNull: false,
		},
	});
}
