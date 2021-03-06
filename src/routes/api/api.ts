import express from "express";
import authRoute from "./auth";

let router = express.Router();

router.get("/", (req, res) => {
	res.json({
		message: "API is working",
	});
});

router.use("/auth", authRoute);

export default router;
