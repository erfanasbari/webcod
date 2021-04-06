import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import cheerio from "cheerio";
import config from "@config/configuration";
import prisma from "@db/client";
import configurePassport from "@config/passport";

// Routes
import apiRoute from "@routes/api/api";

const startServer = () => {
	// ======================= Database ======================= //

	// ======================= Express ======================= //
	const app = express();

	if (process.env.NODE_ENV === "development") {
		app.use(
			cors({
				origin: "http://localhost:3000",
				credentials: true,
			})
		);
	}

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(helmet()); // Secure the server
	app.use(session({ secret: config.session.secret, resave: false, saveUninitialized: false }));

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

	// ====== Listning for requests ====== //
	app.listen(config.address.port, () => {
		console.log(`Webcod server listening on: ${config.address.url}`);
	});
};

startServer();
