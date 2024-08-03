import { config as dotenvConfig } from "@dotenvx/dotenvx";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import schema from "./schemas";

const env = dotenvConfig().parsed || {};

const tursoClient = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN,
});

export default drizzle(tursoClient, { schema });
