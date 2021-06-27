import { ErrorRequestHandler } from "express";
import { AppError } from "@helpers/errorHandling";
import { sendErrorDev, sendErrorProd } from "@helpers/errorHandling";
import { logger } from "@config/pino";

export const errorHandler: ErrorRequestHandler = (err: AppError, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	logger.error(`
  Error: ${err.name}
  Status code: ${err.statusCode}
  Message: ${err.message}
  Stack: ${err.stack}
  `);

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === "production") {
		sendErrorProd(err, res);
	}
};
