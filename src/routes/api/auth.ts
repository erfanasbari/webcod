import express from "express";
import { body } from "express-validator";
import { validateSequential } from "../../include/validator";

// Controllers
import { registerRoute, loginRoute, logoutRoute, userRoute, checkIsAuthenticated, checkIsNotAuthenticated } from "../../controllers/authenticate";

let router = express.Router();

router.post("/register", checkIsNotAuthenticated, validateSequential([body("username").isString().isLength({ min: 3, max: 32 }), body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 6 })]), registerRoute);
router.post("/login", checkIsNotAuthenticated, validateSequential([body("username").isString().isLength({ min: 3, max: 32 }), body("password").isLength({ min: 6 })]), loginRoute);
router.delete("/logout", checkIsAuthenticated, logoutRoute);
router.get("/user", checkIsAuthenticated, userRoute);

export default router;
