import { resolve } from "node:path";
import { config as dotenvConfig } from "@dotenvx/dotenvx";
import type { Config } from "drizzle-kit";

const cwd = process.cwd();

const env = dotenvConfig().parsed || {};

export default {
	driver: "turso",
	dialect: "sqlite",
	schema: `${resolve(cwd, "src", "resume", "schemas")}/*`,
	out: resolve(cwd, "migrations", "resume"),
	dbCredentials: {
		url: env.TURSO_DATABASE_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	},
} satisfies Config;
