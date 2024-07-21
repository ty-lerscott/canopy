import { resolve } from "node:path";
import { config as dotenvConfig } from "@dotenvx/dotenvx";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schemas from "./schemas";
import * as relations from "./schemas/relations";

const schema = {
	...schemas,
	...relations,
};

const env =
	dotenvConfig({
		path: resolve(resolve(process.cwd(), "..", "database"), ".env"),
	}).parsed || {};

const tursoClient = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN,
});

export default drizzle(tursoClient, { schema });
