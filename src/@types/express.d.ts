import { users, servers, nehoscreenshotuploader_screenshots } from "@prisma/client";
import express, { NextFunction } from "express";

declare global {
	namespace Express {
		type AsyncRequestHandler = (req: express.Request, res: express.Response, next: NextFunction) => Promise<any>;
		interface User extends users {}
		interface Request {
			server: servers;
			nehoscreenshotuploader: {
				screenshots: nehoscreenshotuploader_screenshots[];
			};
		}
	}
}
