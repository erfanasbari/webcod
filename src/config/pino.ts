import pino from "pino";
import expressPino from "express-pino-logger";
import config from "./configuration";

export const logger = pino({ level: config.log.level, prettyPrint: true });
export const expressLogger = expressPino({ logger, level: "error" });
