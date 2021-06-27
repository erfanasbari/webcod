import { RequestHandler } from "express";
import { validationResult, ValidationChain } from "express-validator";
import config from "@config/configuration";

export const isValidAppId = (appId: string) => {
	for (const [key, value] of Object.entries(config.appIds)) {
		if (appId === value) return true;
	}
	return false;
};

export const validateSequential = (validations: ValidationChain[]) => {
	return (async (req, res, next) => {
		for (let validation of validations) {
			const result = await validation.run(req);
			if (!result.isEmpty()) return res.status(400).json({ errors: result.array() });
		}
		await next();
	}) as RequestHandler;
};

export const validateParallel = (validations: ValidationChain[]) => {
	return (async (req, res, next) => {
		await Promise.all(validations.map((validation) => validation.run(req)));

		const errors = validationResult(req);
		if (errors.isEmpty()) return await next();

		res.status(400).json({ errors: errors.array() });
	}) as RequestHandler;
};
