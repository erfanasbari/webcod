import express from "express";
import fs from "fs";
import path from "path";
import config from "@config/configuration";
import prisma from "@db/client";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import { getScreenshotsFromQuery } from "@middlewares/plugins/nehoscreenshotuploader";

const pluginConfig = config.plugins.nehoscreenshotuploader;

let router = express.Router({ mergeParams: true });

router.get("/", getScreenshotsFromQuery(), async (req, res) => {
	res.json({
		screenshots: req.nehoscreenshotuploader.screenshots.map((screenshot) => ({
			id: screenshot.id,
			map_name: screenshot.map_name,
			player_name: screenshot.player_name,
			server_id: screenshot.server_id,
			screenshot_url: screenshot.screenshot_name,
			time_submitted: screenshot.time_submitted,
		})),
	});
});

router.get("/file", getScreenshotsFromQuery(true, 2), async (req, res) => {
	if (req.nehoscreenshotuploader.screenshots.length > 1)
		return res.status(400).json({ errors: [{ message: "Multiple files found. please specify the screenshot id." }] });
	const screenshot = req.nehoscreenshotuploader.screenshots[0];
	res.sendFile(path.join(pluginConfig.uploadsDir.screenshots, screenshot.screenshot_name), (err) => {
		if (err) return res.status(500).json({ errors: [{ message: "Unable to find screenshot file." }] });
	});
});

router.delete("/delete", checkIsAuthenticated, checkUserRole(80), getScreenshotsFromQuery(false), async (req, res) => {
	const screenshots = req.nehoscreenshotuploader.screenshots;
	const screenshotsIds = screenshots.map((screenshot) => screenshot.id);
	const errors: { message: string }[] = [];

	// Delete screenshots records from database
	await prisma.nehoscreenshotuploader_screenshots.deleteMany({
		where: { id: { in: screenshotsIds } },
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

export default router;
