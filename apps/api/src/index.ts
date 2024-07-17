import ServerStarter, { server } from "./api/server";
import * as Sentry from "@sentry/node";

(async () => {
	Sentry.setupExpressErrorHandler(server);

	await ServerStarter();
})();
