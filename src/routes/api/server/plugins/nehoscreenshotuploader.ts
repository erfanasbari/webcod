import express from "express";
import fs from "fs";
import path from "path";
import config from "@config/configuration";
import prisma from "@db/client";
import { body } from "express-validator";
import { strtr } from "locutus/php/strings";
import { v4 as uuidv4 } from "uuid";
import querystring from "querystring";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import { validateSequential } from "@helpers/validator";
import { validateIdentkey, validateRcon } from "@middlewares/plugins/nehoscreenshotuploader";

const pluginConfig = {
	uploadsDir: {
		main: path.join(config.uploadsDir.plugins, "nehoscreenshotuploader"),
		get screenshots() {
			return path.join(this.main, "screenshots");
		},
	},
};

let router = express.Router({ mergeParams: true });

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

export default router;
