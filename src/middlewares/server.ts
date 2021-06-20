import { Request, Response, NextFunction } from "express";
import prisma from "@db/client";
import { catchAsync, AppError } from "@helpers/errorHandling";

export const findServerIdFromSlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.serverSlug;
  if (!slug) throw new Error();
  const server = await prisma.servers.findUnique({ where: { slug } });
  if (!server) return res.status(400).json({ errors: [{ message: "Invalid server slug." }] });
  req.server = server;
  return next();
});
