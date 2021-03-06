import express from "express";
import path from "path";
import helmet from "helmet";
import passport from "passport";
import session from "express-session";
import config from "./src/config/configuration";
import sequelize from "./src/database/sequelize";
import configurePassport from "./src/config/passport";

// Routes
import apiRoute from "./src/routes/api/api";

function startServer() {
	// ======================= Database ======================= //
	sequelize
		.authenticate()
		.then(() => {
			console.log("Connected to database successfully.");
		})
		.catch((error) => {
			throw error;
		});

	// ======================= Express ======================= //
	const app = express();

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
		console.log(`Webcod server listening on port: ${config.address.url}`);
	});
}

startServer();
