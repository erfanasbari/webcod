import express from "express";
import fs from "fs";
import path from "path";
import { isString } from "lodash";
import config from "@config/configuration";
import prisma from "@db/client";
import { body, query } from "express-validator";
import { strtr } from "locutus/php/strings";
import { v4 as uuidv4 } from "uuid";
import querystring from "querystring";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import { validateSequential } from "@helpers/validator";
import { validateIdentkey, validateRcon, initialRequestObject } from "@middlewares/plugins/nehoscreenshotuploader";

import screenshotRoute from "./screenshot";

const pluginConfig = config.plugins.nehoscreenshotuploader;

let router = express.Router({ mergeParams: true });

router.use("/", initialRequestObject);

router.post("/execute", validateIdentkey, validateSequential([body("command").isString()]), async (req, res) => {
	switch (req.body.command) {
		case "HELO": {
			validateRcon(req, res, () => {
				res.send(querystring.stringify({ status: "okey" }));
			});
			break;
		}
		case "submitshot": {
			await validateSequential([body("data").isString()])(req, res, async () => {
				// Convert encoded image to binary buffer
				const image = Buffer.from(strtr(req.body.data, "-_#", "+/="), "base64");

				// Grab the metadata from image
				const metadataString = image.toString("utf-8").substr(image.indexOf("CoD4X"));
				const metadata = metadataString.split("\0", 7);

				// Convert metadata to object
				const imageMetadata = {
					serverId: req.server.id,
					timeSubmitted: Date.parse(metadata[6]) ? new Date() : new Date(),
					playerGuid: metadata[4] ?? "",
					playerName: metadata[3] ?? "",
					mapName: metadata[2] ?? "",
				};

				// Save buffer to an image file
				const screenshot_name = `${uuidv4()}.jpg`;
				fs.writeFileSync(path.join(pluginConfig.uploadsDir.screenshots, screenshot_name), image);

				// Add to database
				await prisma.nehoscreenshotuploader_screenshots.create({
					data: {
						server_id: req.server.id,
						time_submitted: imageMetadata.timeSubmitted.toISOString(),
						player_guid: imageMetadata.playerGuid,
						player_name: imageMetadata.playerName,
						map_name: imageMetadata.mapName,
						screenshot_name,
					},
				});

				res.send(querystring.stringify({ status: "success" }));
			});
			break;
		}
		default: {
			res.status(400).json({ errors: [{ message: "Invalid command." }] });
			break;
		}
	}
});

router.get(
	"/screenshots",
	validateSequential([
		query("page").isInt({ min: 1 }).optional(),
		query("messagesPerPage").isInt({ min: 10, max: 50 }).optional(),
	]),
	async (req, res) => {
		const page = isString(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
		const messagesPerPage =
			isString(req.query.messagesPerPage) && parseInt(req.query.messagesPerPage) > 0
				? parseInt(req.query.messagesPerPage)
				: 10;

		const screenshots = await prisma.nehoscreenshotuploader_screenshots.findMany({
			take: messagesPerPage,
			skip: messagesPerPage * (page - 1),
		});

		res.json({
			screenshots: screenshots.map((screenshot) => ({
				id: screenshot.id,
				map_name: screenshot.map_name,
				player_name: screenshot.player_name,
				server_id: screenshot.server_id,
				screenshot_url: screenshot.screenshot_name,
				time_submitted: screenshot.time_submitted,
			})),
		});
	}
);

router.delete(
	"/screenshots/delete",
	checkIsAuthenticated,
	checkUserRole(80),
	validateSequential([
		body("screenshotsIds")
			.isArray({ min: 1, max: 50 })
			.custom((value: number[]) => {
				if (!value.every(Number.isInteger)) throw new Error("Array does not contain Integers");
				value = [...new Set(value)]; // Removes duplicate numbers
				return true;
			}),
	]),
	async (req, res) => {
		const screenshotsIds = req.body.screenshotsIds as number[];
		const errors: { message: string }[] = [];

		// Get screenshots file name and ids
		const screenshots = await prisma.nehoscreenshotuploader_screenshots.findMany({
			select: { id: true, screenshot_name: true },
			where: {
				id: { in: screenshotsIds },
				server_id: req.server.id,
			},
		});

		if (!screenshots.length) return res.status(400).json({ message: "Invalid screenshots Ids." });

		// Delete screenshots records from database
		await prisma.nehoscreenshotuploader_screenshots.deleteMany({
			where: {
				id: { in: screenshotsIds },
				server_id: req.server.id,
			},
		});

		// Loop through found screenshots and delete screenshot file
		screenshots.forEach((screenshot, index) => {
			fs.unlink(path.join(pluginConfig.uploadsDir.screenshots, screenshot.screenshot_name), (err) => {
				if (err) errors.push({ message: `Unable to delete screenshot ${screenshot.id} file.` });
				if (index === screenshots.length - 1) {
					if (errors.length)
						return res.json({
							message: "Screenshot deleted with errors.",
							errors,
						});
					return res.json({ message: "Screenshot deleted successfully." });
				}
			});
		});
	}
);

router.delete("/screenshots/deleteAll", checkIsAuthenticated, checkUserRole(80), async (req, res) => {
	const errors: { message: string }[] = [];

	// Get screenshots file name and ids
	const screenshots = await prisma.nehoscreenshotuploader_screenshots.findMany({
		select: { id: true, screenshot_name: true },
		where: { server_id: req.server.id },
	});

	if (!screenshots.length) return res.status(400).json({ message: "No screenshots to delete." });

	// Delete screenshots records from database
	await prisma.nehoscreenshotuploader_screenshots.deleteMany({
		where: { server_id: req.server.id },
	});

	// Loop through found screenshots and delete screenshot file
	screenshots.forEach((screenshot, index) => {
		fs.unlink(path.join(pluginConfig.uploadsDir.screenshots, screenshot.screenshot_name), (err) => {
			if (err) errors.push({ message: `Unable to delete screenshot ${screenshot.id} file.` });
			if (index === screenshots.length - 1) {
				if (errors.length)
					return res.json({
						message: "Screenshot deleted with errors.",
						errors,
					});
				return res.json({ message: "Screenshot deleted successfully." });
			}
		});
	});
});

router.use("/screenshots/:screenshotId", screenshotRoute);

export default router;
