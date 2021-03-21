import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import config from "@config/configuration";

export function isValidAppId(appId: string) {
	for (const [key, value] of Object.entries(config.appIds)) {
		if (appId === value) return true;
	}
	return false;
}

export function validateSequential(validations: ValidationChain[]) {
	return async (req: Request, res: Response, next: NextFunction) => {
		for (let validation of validations) {
			const result = await validation.run(req);
			if (!result.isEmpty()) {
				return res.status(400).json({ errors: result.array() });
			}
		}
		next();
	};
}

export function validateParallel(validations: ValidationChain[]) {
	return async (req: Request, res: Response, next: NextFunction) => {
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}

		res.status(400).json({ errors: errors.array() });
	};
}
