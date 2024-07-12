import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import APIController from "@/api/controllers";
import { omit } from "@/api/utils";
import env from "@/tools/dotenv-config.mjs";
import "~/sentry.mjs";
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import next from "next";
import LoggerController from "./logger";

const IS_LOCAL = env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appsDir = resolve(__dirname, "..", IS_LOCAL ? "" : "../src", "apps");
const server = express();
const app = next({ dev: IS_LOCAL, dir: appsDir });
const nextHandler = app.getRequestHandler();

Sentry.setupExpressErrorHandler(server);

const Server = {
	app,
	async start() {
		await this.app.prepare();

		server.use(
			bodyParser.urlencoded({
				extended: true,
			}),
		);
		server.use(express.urlencoded({ extended: false }));
		server.use((req, res, next) => {
			req.method = req.method.toUpperCase();

			req.query = omit(req.query, [
				"auto",
				"w",
				"fit",
				"ixlib",
				"ixid",
			]) as Record<string, string>;

			next();
		});

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

		server.listen(env.PORT, (err?: Error) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${env.PORT}`);
		});
	},
};

(async () => {
	await Server.start();
})();
