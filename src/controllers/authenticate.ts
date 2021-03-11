import { Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import prisma from "../prisma/client";

export async function registerRoute(req: Request, res: Response) {
	try {
		if (await prisma.users.findUnique({ where: { username: req.body.username } })) return res.status(401).json({ errors: [{ message: "This username already exists." }] });
		const hash = await bcrypt.hash(req.body.password, 10);
		const user = await prisma.users.create({
			data: {
				username: req.body.username,
				password: hash,
				email: req.body.email,
				salt_key: "",
			},
		});
		req.logIn(user, () => {
			res.json({ message: "success" });
		});
	} catch (error) {
		res.status(500).json({
			errors: [{ message: "server error" }],
		});
		throw error;
	}
}

export async function loginRoute(req: Request, res: Response, next: NextFunction) {
	passport.authenticate("local", (error, user, info) => {
		if (error) {
			res.status(500).json({
				errors: [{ message: "server error" }],
			});
			throw error;
		}
		if (!user) res.status(401).json({ errors: [info] });
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

export function userRoute(req: Request, res: Response) {
	const user = req.user;
	res.json({
		id: user?.id,
		username: user?.username,
		email: user?.email,
		role: user?.role,
	});
}

export function checkIsAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.isAuthenticated()) return next();
	res.status(400).json({
		errors: [{ message: "no user logged in" }],
	});
}

export function checkIsNotAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (!req.isAuthenticated()) return next();
	res.status(400).json({
		errors: [{ message: "already logged in" }],
	});
}

export function checkUserRole(role: number) {
	return async (req: Request, res: Response, next: NextFunction) => {
		const user = req.user;
		if ((user?.role as number) >= role) return next();
		res.status(403).json({
			errors: [{ message: "insufficient role" }],
		});
	};
}
