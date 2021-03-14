import express from "express";
import authRoute from "./auth";
import serversRoute from "./servers/servers";

let router = express.Router();

router.get("/", (req, res) => {
	res.json({
		message: "API is working",
	});
});

router.use("/auth", authRoute);
router.use("/servers", serversRoute);

export default router;
