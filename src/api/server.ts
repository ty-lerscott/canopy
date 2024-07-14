import env from "@/lib/dotenv.mjs";
import "@/lib/sentry.mjs";
import APIController from "@/api/utils/controllers";
import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cors from "cors";
import express, {
	type RequestHandler,
} from "express";
import LoggerController from "./utils/logger";
import ImagesMiddleware from "./utils/middleware/images";
import RequestMiddleware from "./utils/middleware/request";

const server = express();
Sentry.setupExpressErrorHandler(server);
const IS_LOCAL = env.NODE_ENV === "development";
const urlEncoded = bodyParser.urlencoded({
	extended: true,
});

const start = async () => {
	server.use(cors());
	server.use(bodyParser.json());
	server.use(urlEncoded);
	server.use(RequestMiddleware as RequestHandler);
	server.use(LoggerController);
	server.use(ImagesMiddleware as RequestHandler);
	server.use(APIController as unknown as RequestHandler);

	server.listen(env.PORT, (err?: Error) => {
		if (err) throw err;
		console.log(
			`> Ready on canopy.lerscott.${IS_LOCAL ? `local:${env.PORT}` : "com"}`,
		);
	});
};

export {server};
export default start;