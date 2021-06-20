import { ErrorRequestHandler } from "express";
import { AppError } from "@helpers/errorHandling";
import { sendErrorDev, sendErrorProd } from "@helpers/errorHandling";

export const errorHandler: ErrorRequestHandler = (err: AppError, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log("=".repeat(process.stdout.columns));
  console.log(`Error: ${err.name}`);
  console.log(`Status code: ${err.statusCode}`);
  console.log(`Message: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log("=".repeat(process.stdout.columns));

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};
