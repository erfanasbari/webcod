import { Request, Response, NextFunction } from "express";
import prisma from "@db/client";

export const findServerIdFromSlug = async (req: Request, res: Response, next: NextFunction) => {
	const slug = req.params.serverSlug;
	if (!slug) return res.status(500).json({ errors: [{ message: "Internal server error." }] });
	try {
		const server = await prisma.servers.findUnique({ where: { slug } });
		if (!server) return res.status(400).json({ errors: [{ message: "Invalid server slug." }] });
		req.server = server;
		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ errors: [{ message: "Internal server error." }] });
	}
};
