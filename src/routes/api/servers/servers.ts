import express from "express";
import { isString } from "lodash";
import { body, query } from "express-validator";
import { servers, server_cache, server_options } from "@prisma/client";
import slugify from "slugify";
import mysql from "mysql2";
import serverRoute from "./server";
import prisma from "@db/client";
import { validateSequential, isValidAppId } from "@helpers/validator";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import serverQuery from "@helpers/gemeServer/query";
import serverRcon from "@helpers/gemeServer/rcon";

let router = express.Router();

router.get("/", validateSequential([query("page").isInt({ min: 1 })]), async (req, res) => {
	const serversPerPage = 10;
	const page = isString(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;

	const serversInfo = await prisma.servers.findMany({
		take: serversPerPage,
		skip: serversPerPage * (page - 1),
	});
	const serversOptions = await prisma.server_options.findMany({
		take: serversPerPage,
		skip: serversPerPage * (page - 1),
	});
	let serversCache = await prisma.server_cache.findMany({
		take: serversPerPage,
		skip: serversPerPage * (page - 1),
	});

	for (let i = 0; i < serversCache.length; i++) {
		if (serversCache[i].last_update >= Math.floor(Date.now() / 1000) - 20) continue;
		serversCache[i] = await serverQuery.updateServerCache(
			serversInfo.find((server) => server.id === serversCache[i].server_id) as servers
		);
	}

	const servers = serversInfo.map((serverInfo) => {
		const options = serversOptions.find((serverOption) => serverOption.server_id === serverInfo.id) as server_options;
		const cache = serversCache.find((serverCache) => serverCache.server_id === serverInfo.id) as server_cache;

		return {
			info: {
				appId: serverInfo.appId,
				name: serverInfo.name,
				slug: serverInfo.slug,
				ip: serverInfo.ip,
				port: serverInfo.port,
			},
			options: {},
			cache: {
				name: cache.name,
				map: cache.map,
				max_players: cache.max_players,
				online_players: cache.online_players,
				is_online: cache.is_online,
				last_update: cache.last_update,
			},
		};
	});

	return res.json(servers);
});

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
		let slug = "";

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

		slug = slugify(req.body.name, {
			replacement: "_",
			lower: true,
			locale: "en",
		});
		let tempslug = slug;
		for (let i = 0; true; i++) {
			if (i > 0) tempslug = `${slug}-${i + 1}`;
			if (await prisma.servers.findUnique({ where: { slug: tempslug } })) continue;
			slug = tempslug;
			break;
		}

		const server = await prisma.servers.create({
			data: {
				appId: req.body.appId,
				name: req.body.name,
				slug: slug,
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

		return res.json({ messaage: "Server added successfully." });
	}
);

router.use("/:serverSlug", serverRoute);

export default router;
