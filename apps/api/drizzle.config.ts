import { resolve } from "node:path";
import { config as dotenvConfig } from "@dotenvx/dotenvx";
import type { Config } from "drizzle-kit";

const cwd = process.cwd();
const databasePath = resolve(cwd, "..", "database");
const schemaPath = resolve(cwd, "src", "conductors", "drizzle", "schemas");
const migrationPath = resolve(cwd, "..", "..", "dist", "migrations");

const env =
	dotenvConfig({
		path: resolve(databasePath, ".env"),
	}).parsed || {};

export default {
	driver: "turso",
	dialect: "sqlite",
	schema: `${schemaPath}/*`,
	out: migrationPath,
	dbCredentials: {
		url: env.TURSO_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
} satisfies Config;
