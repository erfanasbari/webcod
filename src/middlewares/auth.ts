import { Request, Response, NextFunction } from "express";
import { RequestHasUser } from "@helpers/auth";

export const checkIsAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
	if (req.isAuthenticated()) {
		if (!req.user) req.logOut();
		else return await next();
	}
	res.status(400).json({
		errors: [{ message: "no user logged in" }],
	});
};

export const checkIsNotAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) return await next();
	res.status(400).json({
		errors: [{ message: "already logged in" }],
	});
};

export const checkUserRole = (role: number) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		RequestHasUser(req);
		if (req.user.role >= role) return await next();
		res.status(403).json({
			errors: [{ message: "insufficient role" }],
		});
	};
};
