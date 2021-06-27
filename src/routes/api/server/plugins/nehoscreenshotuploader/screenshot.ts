import express from "express";
import fs from "fs";
import path from "path";
import { isString } from "lodash";
import config from "@config/configuration";
import prisma from "@db/client";
import { body, query } from "express-validator";
import { validateSequential } from "@helpers/validator";
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
		if (err) return res.json({ errors: [{ message: "Unable to find screenshot file." }] });
	});
});

export default router;
