import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { body, query } from "express-validator";
import { validateSequential } from "@helpers/validator";
import { nehoscreenshotuploader_screenshots } from "@prisma/client";
import prisma from "@db/client";

export const checkIsEnabled: RequestHandler = async (req, res, next) => {
	const serverOptions = await prisma.server_options.findUnique({
		select: { nehoscreenshotsender_enabled: true },
		where: { server_id: req.server.id },
		rejectOnNotFound: true,
	});
	if (!serverOptions.nehoscreenshotsender_enabled)
		return res.json({ errors: [{ message: "NehoScreenshoUploader is disabled." }] });
	await next();
};

export const validateIdentkey: RequestHandler = (req, res, next) => {
	validateSequential([body("identkey").isString().isLength({ min: 3, max: 32 })])(req, res, async () => {
		const serverOptions = await prisma.server_options.findUnique({
			select: { nehoscreenshotsender_identkey: true },
			where: { server_id: req.server.id },
			rejectOnNotFound: true,
		});
		if (!bcrypt.compareSync(req.body.identkey, serverOptions.nehoscreenshotsender_identkey))
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

// Add nehoscreenshotuploader to request object
export const initialRequestObject: RequestHandler = async (req, res, next) => {
	req.nehoscreenshotuploader = {
		screenshots: [{} as nehoscreenshotuploader_screenshots],
	};
	return await next();
};

// Get screenshots array from database and put it in request.nehoscreenshotuploader.screenshots
export const getScreenshotsFromQuery = (navigation = true, defaultMessagesPerPage = 10) =>
	(async (req, res, next) => {
		validateSequential([
			query("id").isInt().toInt().optional(),
			query("page").isInt({ min: 1 }).toInt().optional(),
			query("messagesPerPage").toInt().isInt({ min: 10, max: 50 }).optional(),
		])(req, res, async () => {
			const reqQuery = req.query as any as { page: number; messagesPerPage: number; id?: number };

			const page = reqQuery.page ?? 1;
			const messagesPerPage = reqQuery.messagesPerPage ?? defaultMessagesPerPage;

			const screenshots = await prisma.nehoscreenshotuploader_screenshots.findMany({
				where: { id: reqQuery.id, server_id: req.server.id },
				take: navigation ? messagesPerPage : undefined,
				skip: navigation ? messagesPerPage * (page - 1) : undefined,
			});

			if (!screenshots.length) return res.status(404).json({ message: "No screenshots found." });

			req.nehoscreenshotuploader.screenshots = screenshots;
			return await next();
		});
	}) as RequestHandler;
