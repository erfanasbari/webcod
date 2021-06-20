import "./dotenv";
import { isTrueSet } from "@helpers/functions";

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
	appIds: {
		CoD4x: "CoD4x",
	},
};

export default config;
