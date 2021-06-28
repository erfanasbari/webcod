import { RequestHandler } from "express";
import { body } from "express-validator";
import { validateSequential } from "@helpers/validator";
import { nehoscreenshotuploader_screenshots } from "@prisma/client";
import prisma from "@db/client";
import { AppError } from "@helpers/errorHandling";

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

// Add nehoscreenshotuploader to request object
export const initialRequestObject: RequestHandler = async (req, res, next) => {
	req.nehoscreenshotuploader = {
		screenshot: {} as nehoscreenshotuploader_screenshots,
	};
	return await next();
};

// Get screenshot object from database and put it in request.nehoscreenshotuploader.screenshot
export const getScreenshotFromId: RequestHandler = async (req, res, next) => {
	if (!req.params.screenshotId) throw new AppError(`"req.params.screenshotId" is undefined`);
	const screenshotId = parseInt(req.params.screenshotId);
	const screenshot = await prisma.nehoscreenshotuploader_screenshots.findUnique({ where: { id: screenshotId ?? 0 } });
	if (!screenshot || isNaN(screenshotId))
		return res.status(400).json({ errors: [{ message: "Invalid screenshot id." }] });
	req.nehoscreenshotuploader.screenshot = screenshot;
	return await next();
};
