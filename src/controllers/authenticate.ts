import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import sequelize from "../database/sequelize";

export async function registerRoute(req: Request, res: Response) {
	if (await sequelize.models.user.findOne({ where: { username: req.body.username } })) return res.json({ message: "username already exists" });
	const hash = await bcrypt.hash(req.body.password, 10);
	const user = await sequelize.models.user.create({
		username: req.body.username,
		password: hash,
		email: req.body.email,
		salt_key: "empty",
	});
	res.json({ message: "success" });
}

export async function loginRoute(req: Request, res: Response, next: NextFunction) {
	passport.authenticate("local", (error, user, info) => {
		if (error) throw error;
		if (!user) res.json(info);
		else {
			req.login(user, (err) => {
				if (err) throw err;
				res.json({ message: "success" });
			});
		}
	})(req, res, next);
}

export function logoutRoute(req: Request, res: Response) {
	req.logOut();
	res.json({ message: "success" });
}

export function checkIsAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.isAuthenticated()) return next();
	res.json({
		message: "no user logged in.",
	});
}

export function checkIsNotAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (!req.isAuthenticated()) return next();
	res.json({
		message: "already logged in",
	});
}
