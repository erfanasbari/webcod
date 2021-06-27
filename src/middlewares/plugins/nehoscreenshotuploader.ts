import { Request, RequestHandler } from "express";
import { body } from "express-validator";
import prisma from "@db/client";
import { validateSequential } from "@helpers/validator";

export const validateIdentkey: RequestHandler = (req, res, next) => {
	validateSequential([body("identkey").isString()])(req, res, async () => {
		const serverOptions = await prisma.server_options.findUnique({
			select: { nehoscreenshotsender_identkey: true },
			where: { server_id: req.server.id },
		});
		if (req.body.identkey !== serverOptions?.nehoscreenshotsender_identkey)
			return res.status(400).send({ errors: [{ message: "Wrong identkey." }] });
		await next();
	});
};

export const validateRcon: RequestHandler = (req, res, next) => {
	validateSequential([body("identkey").isString()])(req, res, async () => {
		if (req.body.rcon !== req.server.rcon_password)
			return res.status(400).send({ errors: [{ message: "Wrong RCON password." }] });
		await next();
	});
};
