import express from "express";
import { Model } from "sequelize";
import { body } from "express-validator";
import { validateSequential } from "../../include/validator";

// Controllers
import { registerRoute, loginRoute, logoutRoute, checkIsAuthenticated, checkIsNotAuthenticated } from "../../controllers/authenticate";

let router = express.Router();

router.post("/register", checkIsNotAuthenticated, validateSequential([body("username").isString().isLength({ min: 5 }), body("email").isEmail(), body("password").isLength({ min: 6 })]), registerRoute);
router.post("/login", checkIsNotAuthenticated, validateSequential([body("username").isString().isLength({ min: 5 }), body("password").isLength({ min: 6 })]), loginRoute);
router.post("/logout", checkIsAuthenticated, logoutRoute);
router.get("/user", checkIsAuthenticated, (req, res) => {
	const user = req.user as Model;
	res.json({
		id: user.get("id"),
		username: user.get("username"),
		email: user.get("email"),
		role: user.get("role"),
	});
});

export default router;
