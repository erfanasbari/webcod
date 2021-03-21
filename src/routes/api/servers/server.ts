import express from "express";
import { body } from "express-validator";
import mysql from "mysql2";
import prisma from "@db/client";
import { validateSequential, isValidAppId } from "@helpers/validator";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import { findServerIdFromSlug } from "@middlewares/server";
import serverQuery from "@helpers/gemeServer/query";
import serverRcon from "@helpers/gemeServer/rcon";

let router = express.Router({ mergeParams: true });

router.use("/", findServerIdFromSlug);

router.delete("/delete", checkIsAuthenticated, checkUserRole(80), async (req, res) => {
	try {
		await prisma.servers.delete({ where: { id: req.server.id } });
		await prisma.server_options.delete({ where: { server_id: req.server.id } });
		await prisma.server_cache.delete({ where: { server_id: req.server.id } });
		return res.json({ message: "Server deleted successfully." });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ errors: [{ message: "Internal server error." }] });
	}
});

export default router;
