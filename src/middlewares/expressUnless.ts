import { RequestHandler } from "express";

export const expressUnless = (unlessArray: string[], middleware: RequestHandler) =>
	(async (req, res, next) => {
		for (const unless of unlessArray) {
			if (unless === req.path) return await next();
		}
		return await middleware(req, res, next);
	}) as RequestHandler;
