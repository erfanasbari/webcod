import express from "express";
import authRoute from "./auth";
import { catchAsync, AppError } from "@helpers/errorHandling";
import { checkIsAuthenticated, checkUserRole } from "@middlewares/auth";
import serversRoute from "./servers/servers";

let router = express.Router();

router.get("/", (req, res) => {
	res.json({
		message: "API is working",
	});
});

router.get(
  "/errorHandlingTest",
  checkIsAuthenticated,
  checkUserRole(100),
  catchAsync(async (req, res) => {
    throw new AppError("Error Handling Test");
  })
);

router.use("/auth", authRoute);
router.use("/servers", serversRoute);

export default router;
