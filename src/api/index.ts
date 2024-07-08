import Controller from "@/api/utils/controllers";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import winston from "winston";

const logger = winston.createLogger({
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

const Logger = (req: Request, res: Response, next: NextFunction) => {
	logger.info(`${req.method} ${req.url}`);
	next();
};

const app = express();
app.use(Logger);
app.get("*", Controller(logger));

export default app;
