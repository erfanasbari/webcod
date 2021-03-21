import { Request, Response, NextFunction } from "express";
import { RequestHasUser } from "@helpers/auth";

export function checkIsAuthenticated(req: Request, res: Response, next: NextFunction) {
	if (req.isAuthenticated()) {
		if (!req.user) req.logOut();
		else return next();
	}
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
		RequestHasUser(req);
		if (req.user.role >= role) return next();
		res.status(403).json({
			errors: [{ message: "insufficient role" }],
		});
	};
}
