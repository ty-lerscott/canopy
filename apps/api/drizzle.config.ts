import { resolve } from "node:path";
import { config as dotenvConfig } from "@dotenvx/dotenvx";
import type { Config } from "drizzle-kit";

const cwd = process.cwd();
const schemaPath = resolve(cwd, "src", "tools", "drizzle", "schemas");
const migrationPath = resolve(cwd, "..", "..", "dist", "migrations");

const env = dotenvConfig().parsed || {};

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
