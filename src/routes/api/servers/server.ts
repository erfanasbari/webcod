import express from "express";
import prisma from "@db/client";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import { findServerIdFromSlug } from "@middlewares/server";
import serverQuery from "@helpers/gemeServer/query";

let router = express.Router({ mergeParams: true });

router.use("/", findServerIdFromSlug);

router.get("/", async (req, res) => {
	const serverOptions = await prisma.server_options.findUnique({
		where: { server_id: req.server.id },
		rejectOnNotFound: true,
	});
	let serverCache = await prisma.server_cache.findUnique({
		where: { server_id: req.server.id },
		rejectOnNotFound: true,
	});
	if (serverCache.last_update < Math.floor(Date.now() / 1000) - 20)
		serverCache = await serverQuery.updateServerCache(req.server);

	return res.json({
		info: {
			appId: req.server.appId,
			name: req.server.name,
			slug: req.server.slug,
			ip: req.server.ip,
			port: req.server.port,
		},
		options: {
			nehoscreenshotsender_enabled: serverOptions.nehoscreenshotsender_enabled,
		},
		cache: {
			name: serverCache.name,
			rules: serverCache.rules,
			map: serverCache.map,
			max_players: serverCache.max_players,
			online_players: serverCache.online_players,
			players_info: serverCache.players_info,
			is_online: serverCache.is_online,
			last_update: serverCache.last_update,
		},
	});
});

router.delete("/delete", checkIsAuthenticated, checkUserRole(80), async (req, res) => {
	await prisma.servers.delete({ where: { id: req.server.id } });
	await prisma.server_options.delete({ where: { server_id: req.server.id } });
	await prisma.server_cache.delete({ where: { server_id: req.server.id } });
	return res.json({ message: "Server deleted successfully." });
});

export default router;
