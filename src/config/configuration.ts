import "./dotenv";
import { isTrueSet } from "@helpers/functions";
import path from "path";

const config = {
	db: {
		dialect: "mysql",
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "",
		name: process.env.DB_NAME || "webcod",
	},
	address: {
		SSL: isTrueSet(process.env.ADDRESS_SSL),
		domain: process.env.ADDRESS_DOMAIN || "localhost",
		port: parseInt(process.env.ADDRESS_PORT ?? "") || 80,
		httpsPort: parseInt(process.env.ADDRESS_HTTPS_PORT ?? "") || 443,
		get url() {
			return `${this.SSL ? "https" : "http"}://${this.domain}${
				![80, 443].includes(this.port) ? `:${this.SSL ? this.httpsPort : this.port}` : ""
			}`;
		},
	},
	session: {
		secret: process.env.SESSION_SECRET || "Test Secret",
	},
	log: {
		level: process.env.LOG_LEVEL || "info",
	},
	appIds: {
		CoD4x: "CoD4x",
	},
	uploadsDir: {
		main: path.join(process.cwd(), "uploads/"),
		get plugins() {
			return this.main + "plugins/";
		},
	},
};

export default config;
