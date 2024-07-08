import Controller from "@/api/utils/controllers";
import dotenv from "dotenv";
import express, {
	type Response,
	type Request,
	type NextFunction,
} from "express";
import winston from "winston";

dotenv.config({
	path: ".env.local",
});

const logger = winston.createLogger({
	level: "info",
	format: winston.format.json(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

const Logger = (req: Request, res: Response, next: NextFunction) => {
	logger.info(`${req.method} ${req.url}`);
	next();
};

const app = express();
app.use(Logger);
app.get("*", Controller(logger));

app.listen(Number(process.env.PORT) || 3000, () =>
	console.log(`Server is listening on port ${Number(process.env.PORT)}`),
);
