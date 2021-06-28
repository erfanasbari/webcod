import express from "express";
import fs from "fs";
import path from "path";
import config from "@config/configuration";
import prisma from "@db/client";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import { getScreenshotFromId } from "@middlewares/plugins/nehoscreenshotuploader";

const pluginConfig = config.plugins.nehoscreenshotuploader;

let router = express.Router({ mergeParams: true });

router.use("/", getScreenshotFromId);

router.get("/", async (req, res) => {
	const screenshot = req.nehoscreenshotuploader.screenshot;

	res.json({
		screenshot: {
			id: screenshot.id,
			map_name: screenshot.map_name,
			player_name: screenshot.player_name,
			server_id: screenshot.server_id,
			screenshot_url: screenshot.screenshot_name,
			time_submitted: screenshot.time_submitted,
		},
	});
});

router.get("/file", async (req, res) => {
	const screenshot = req.nehoscreenshotuploader.screenshot;
	res.sendFile(path.join(pluginConfig.uploadsDir.screenshots, screenshot.screenshot_name), (err) => {
		if (err) return res.status(500).json({ errors: [{ message: "Unable to find screenshot file." }] });
	});
});

router.delete("/delete", checkIsAuthenticated, checkUserRole(80), async (req, res) => {
	const screenshot = req.nehoscreenshotuploader.screenshot;
	await prisma.nehoscreenshotuploader_screenshots.delete({ where: { id: screenshot.id } });
	fs.unlink(path.join(pluginConfig.uploadsDir.screenshots, screenshot.screenshot_name), (err) => {
		if (err)
			return res.json({
				message: "Screenshot deleted with errors.",
				errors: [{ message: "Unable to delete screenshot file." }],
			});
		return res.json({ message: "Screenshot deleted successfully." });
	});
});

export default router;
