import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import config from "./src/config/configuration";
import prisma from "./src/prisma/client";
import configurePassport from "./src/config/passport";

// Routes
import apiRoute from "./src/routes/api/api";

function startServer() {
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
	app.use(express.static(path.join(__dirname, "/client/build"))); // Serve React static files
	// Render app index.html file to client on any route that doesn't found; So react-router can handle that.
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname + "/client/build/index.html"));
	});

	// ====== Listning for requests ====== //
	app.listen(config.address.port, () => {
		console.log(`Webcod server listening on: ${config.address.url}`);
	});
}

startServer();
