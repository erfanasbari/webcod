import { Request } from "express";

export function RequestHasUser(req: Request): asserts req is Request & Express.AuthenticatedRequest {
	if (!("user" in req)) {
		throw new Error("Request object without user found unexpectedly");
	}
}
