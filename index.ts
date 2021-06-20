import express from "express";
import https from "https";
import http from "http";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import cheerio from "cheerio";
import config from "@config/configuration";
import prisma from "@db/client";
import configurePassport from "@config/passport";
import { errorHandler } from "@middlewares/errorHandling";

// Routes
import apiRoute from "@routes/api/api";

const startServer = () => {
	// ======================= Database ======================= //

	// ======================= Express ======================= //
	const app = express();

	if (process.env.NODE_ENV === "development") {
		app.use(
			cors({
				origin: ["http://localhost:3000", "https://localhost:3000"],
				credentials: true,
			})
		);
	}

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(helmet()); // Secure the server
	app.use(
		session({
			secret: config.session.secret,
			resave: false,
			saveUninitialized: false,
			store: new PrismaSessionStore(prisma, {
				checkPeriod: 2 * 60 * 1000,
				dbRecordIdIsSessionId: true,
			}),
		})
	);

	// ============= passport ============= //
	app.use(passport.initialize());
	app.use(passport.session());
	configurePassport(passport);

	// ============= Routing ============= //
	// ====== api ====== //
	app.use("/api", apiRoute);

	// ====== Serve React client app ====== //
	// Adding <base> to index.html
	const $IndexHtml = cheerio.load(fs.readFileSync(path.join(__dirname + "/client/build/index.html"), "utf8"));
	$IndexHtml("head title").after(`<base href="${config.address.url}/" />`);
	const indexHtml = $IndexHtml.html();

	app.get(["/", "/index.html"], (req, res) => res.send(indexHtml)); // Send modified index instead of index.html
	app.use(express.static(path.join(__dirname, "/client/build"))); // Serve React static files
	app.get("*", (req, res) => res.send(indexHtml)); // Send modified index on 404 so react-router can handle that

	// ============= Error Handling ============= //
	app.use(errorHandler);

	// ====== Listning for requests ====== //
	if (config.address.SSL) {
		const options: https.ServerOptions = {
			key: fs.readFileSync(path.join(__dirname, ".ssl", "key.pem")),
			cert: fs.readFileSync(path.join(__dirname, ".ssl", "cert.pem")),
		};
		const httpsServer = https.createServer(options, app);
		httpsServer.listen(config.address.httpsPort, () => {
			console.log(`Secure server listening on ${config.address.url}`);
		});

		// Create an http redirect
		const httpApp = express();
		httpApp.use("*", (req, res) => {
			res.redirect(config.address.url + req.originalUrl);
		});
		const httpServer = http.createServer(httpApp);
		httpServer.listen(config.address.port);
	} else {
		// Create just http server if SSL is set to false
		app.listen(config.address.port, () => {
			console.log(`Server listening on: ${config.address.url}`);
		});
	}
};

startServer();
