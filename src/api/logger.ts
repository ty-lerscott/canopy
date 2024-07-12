import type { NextFunction, Request, Response } from "express";
import omit from "object.omit";
import winston from "winston";

export const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: "./logs/error.log",
			level: "error",
		}),
		new winston.transports.File({ filename: "./logs/combined.log" }),
	],
});

const LoggerController = (req: Request, res: Response, next: NextFunction) => {
	const query = omit(req.query, ["auto", "w", "fit", "ixlib", "ixid"]);
	const hasQuery = Object.values(query).some(Boolean);
	const url = req.url.split("?")[0];

	if (!/^\/(monitoring|_next)/.test(url)) {
		logger.info(`${req.method} ${url}`, hasQuery && { query });
	}

	next();
};

export default LoggerController;
