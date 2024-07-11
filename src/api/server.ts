import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import APIController from "@/api/controllers";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { type Request, type Response, NextFunction } from "express";
import next from "next";

import LoggerController from "./logger";

// TODO: check if needed now
config();

const PORT = process.env.PORT || 3000;
const IS_LOCAL = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appsDir = resolve(__dirname, "..", IS_LOCAL ? "" : "../src", "apps");
const app = next({ dev: IS_LOCAL, dir: appsDir });
const nextHandler = app.getRequestHandler();

const Server = {
	app,
	async start() {
		await this.app.prepare();
		const server = express();

		server.use(
			bodyParser.urlencoded({
				extended: true,
			}),
		);
		server.use(bodyParser.json());
		server.use(cors());
		server.use(LoggerController);
		server.use("/_next", express.static(resolve(__dirname, ".next")));

		server.use((req, res, next) => {
			const isImageResource = req.url.match(/\/(images)\//);

			if (isImageResource) {
				const newUrl = req.url.substring(
					isImageResource.index as number,
					req.url.length,
				);
				req.url = newUrl;
				req.originalUrl = newUrl;

				express.static("public")(req, res, next);
			} else {
				next();
			}
		});

		// Handle API requests
		server.use(APIController);

		// Handle All other GET requests through the next handler
		server.get("*", (req: Request, res: Response) => {
			return nextHandler(req, res);
		});

		server.listen(PORT, (err?: Error) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${PORT}`);
		});
	},
};

(async () => {
	await Server.start();
})();
