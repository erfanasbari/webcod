import express from "express";
import path from "path";
import helmet from "helmet";
import config from "./src/config/configuration";
import sequelize from "./src/database/sequelize";

// Routes
import apiRoute from "./src/routes/api/api";

function startServer() {
	// ======================= Database ======================= //
	sequelize.authenticate().catch((error) => {
		console.error("Failed to connect to database. Error: ");
		console.error(error);
	});

	// ======================= Express ======================= //
	const app = express();

	app.use(express.json());
	app.use(helmet()); // Secure the server

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
