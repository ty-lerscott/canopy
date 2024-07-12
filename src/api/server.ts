import "~/dotenv.mjs";
import "~/sentry.mjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import APIController from "@/api/utils/controllers";
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cors from "cors";
import express, {
	type Response,
	type RequestHandler,
	type Request as ExpressRequest,
} from "express";
import next from "next";
import LoggerController from "./utils/logger";
import ImagesMiddleware from "./utils/middleware/images";
import RequestMiddleware from "./utils/middleware/request";

const IS_LOCAL = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const appsDir = resolve(__dirname, "..", IS_LOCAL ? "" : "../src", "apps");
const server = express();
const app = next({ dev: IS_LOCAL, dir: appsDir });
const requestHandler = app.getRequestHandler();
const urlEncoded = bodyParser.urlencoded({
	extended: true,
});

const nextHandler = (req: ExpressRequest, res: Response) =>
	requestHandler(req, res);

Sentry.setupExpressErrorHandler(server);

const Server = {
	app,
	async start() {
		await this.app.prepare();

		server.use(cors());
		server.use(bodyParser.json());
		server.use(urlEncoded);
		server.use(RequestMiddleware as RequestHandler);
		server.use(LoggerController);
		server.use(ImagesMiddleware as RequestHandler);
		server.use("/_next", express.static(resolve(__dirname, ".next")));
		server.use(APIController as unknown as RequestHandler);
		server.get("*", (req, res) => nextHandler(req, res));

		server.listen(process.env.PORT, (err?: Error) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${process.env.PORT}`);
		});
	},
};

(async () => {
	await Server.start();
})();
