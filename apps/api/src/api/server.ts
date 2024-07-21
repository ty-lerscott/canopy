import env from "@/lib/dotenv";
import "@/lib/sentry.mjs";
import bodyParser from "body-parser";
import cors from "cors";
import express, { type RequestHandler } from "express";
import helmet from "helmet";
import APIController from "./utils/controllers";
import LoggerController from "./utils/logger";
import ImagesMiddleware from "./utils/middleware/images";

const server = express();
const IS_LOCAL = env.NODE_ENV !== "production";
const urlEncoded = bodyParser.urlencoded({
	extended: true,
});

const start = async () => {
	server.use(cors());
	server.use(helmet());
	server.use(bodyParser.json());
	server.use(urlEncoded);
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

export { server };
export default start;
