import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { body } from "express-validator";
import { validateSequential } from "@helpers/validator";
import { catchAsync } from "@helpers/errorHandling";
import prisma from "@db/client";

import { RequestHasUser } from "@helpers/auth";
import { checkIsAuthenticated, checkIsNotAuthenticated } from "@middlewares/auth";

let router = express.Router();

router.post(
	"/register",
	checkIsNotAuthenticated,
	validateSequential([
		body("username").isString().isLength({ min: 3, max: 32 }),
		body("email").isEmail().normalizeEmail(),
		body("password").isLength({ min: 6 }),
	]),
	catchAsync(async (req, res) => {
		if (await prisma.users.findUnique({ where: { username: req.body.username } }))
			return res.status(401).json({ errors: [{ message: "This username already exists." }] });
		const hash = await bcrypt.hash(req.body.password, 10);
		const user = await prisma.users.create({
			data: {
				username: req.body.username,
				password: hash,
				email: req.body.email,
			},
		});
		req.logIn(user, () => {
			res.json({ message: "success" });
		});
	})
);

router.post(
	"/login",
	checkIsNotAuthenticated,
	validateSequential([
		body("username").isString().isLength({ min: 3, max: 32 }),
		body("password").isLength({ min: 6 }),
	]),
	catchAsync(async (req, res, next) => {
		passport.authenticate("local", (error, user, info) => {
			if (error) return next(error);
			if (!user) res.status(401).json({ errors: [info] });
			else {
				req.login(user, (err) => {
					if (err) throw err;
					res.json({ message: "success" });
				});
			}
		})(req, res, next);
	})
);

router.delete("/logout", checkIsAuthenticated, (req, res) => {
	req.logOut();
	res.json({ message: "success" });
});

router.get("/user", checkIsAuthenticated, (req, res) => {
	RequestHasUser(req);
	res.json({
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		role: req.user.role,
	});
});

export default router;
