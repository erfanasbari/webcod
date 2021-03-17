import express from "express";
import { body } from "express-validator";
import mysql from "mysql2";
import prisma from "../../../prisma/client";
import { validateSequential, isValidAppId } from "../../../helpers/validator";
import { checkIsAuthenticated, checkUserRole } from "../../../middlewares/auth";
import serverQuery from "../../../helpers/gemeServer/query";
import serverRcon from "../../../helpers/gemeServer/rcon";

let router = express.Router();

router.post(
	"/add",
	checkIsAuthenticated,
	checkUserRole(80),
	validateSequential([
		body("appId")
			.isString()
			.custom((value) => {
				if (!isValidAppId(value)) throw new Error("Server Type is not supported.");
				return true;
			}),
		body("name").isString().isLength({ min: 3, max: 255 }),
		body("host").isString().isLength({ max: 255 }),
		body("port").isPort(),
		body("rconPassword").isString().notEmpty().isLength({ max: 255 }),
		body("dbHost").optional().isString().isLength({ max: 255 }),
		body("dbPort").optional().isPort(),
		body("dbUser").optional().isString().isLength({ max: 255 }),
		body("dbPassword").optional().isString().isLength({ max: 255 }),
		body("dbName").optional().isString().isLength({ max: 255 }),
	]),
	async (req, res) => {
		let dbEnabled = false;

		if (await prisma.servers.findUnique({ where: { name: req.body.name } }))
			return res.status(400).json({ errors: [{ message: "This server name already exist." }] });

		if (!(await serverQuery.isOnline(req.body.appId, req.body.host, req.body.port, 3000)))
			return res.status(400).json({ errors: [{ message: "This server is offline." }] });

		if (!(await serverRcon.isRcon(req.body.appId, req.body.host, req.body.port, req.body.rconPassword, 3000)))
			return res.status(400).json({ errors: [{ message: "Wrong rcon password." }] });

		if (req.body.dbHost) {
			const db = mysql.createConnection({
				host: req.body.dbHost,
				port: req.body.dbPort,
				user: req.body.dbUser,
				password: req.body.dbPassword,
				database: req.body.dbName,
			});
			try {
				await db.promise().query("SELECT 1");
				dbEnabled = true;
			} catch (error) {
				return res.status(400).json({ errors: [{ message: "Cannot connect to the database." }] });
			}
			db.end();
		}

		try {
			const server = await prisma.servers.create({
				data: {
					appId: req.body.appId,
					name: req.body.name,
					ip: req.body.host,
					port: req.body.port,
					rcon_password: req.body.rconPassword,
					db_enabled: dbEnabled,
					db_host: req.body.dbHost,
					db_port: req.body.dbPort,
					db_username: req.body.dbUser,
					db_password: req.body.dbPassword,
					db_name: req.body.dbName,
				},
			});

			await prisma.server_options.create({ data: { server_id: server.id } });

			await prisma.server_cache.create({ data: { server_id: server.id } });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ errors: [{ message: "Internal server error." }] });
		}

		return res.json({ messaage: "Server added successfully." });
	}
);

export default router;
