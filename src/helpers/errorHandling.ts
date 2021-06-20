import { Response, Request, NextFunction } from "express";

export interface AppError {
	message: string;
	statusCode: number;
	status: string;
	isOperational: true;
}

export class AppError extends Error {
	constructor(message: string, statusCode: number = 500) {
		super(message);

		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

export const sendErrorDev = (err: AppError, res: Response) => {
	res.status(err.statusCode).json({
		errors: [{ error: err, message: err.message, stack: err.stack }],
	});
};

export const sendErrorProd = (err: AppError, res: Response) => {
	res.status(err.statusCode).json({
		errors: [{ message: err.message }],
	});
};

export const catchAsync = (fn: Express.AsyncRequestHandler) =>
	((req: Request, res: Response, next) => {
		fn(req, res, next).catch(next);
	}) as Express.AsyncRequestHandler;
