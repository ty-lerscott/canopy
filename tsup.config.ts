import dotenv from "dotenv";
import { defineConfig } from "tsup";

const env = dotenv.config().parsed;
const IS_LOCAL =
	env?.NODE_ENV === "development" || process.env.NODE_ENV === "development";

console.log({ IS_LOCAL, DISCORD: process.env.DISCORD_WEBHOOK_URL });

export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts"],
	outDir: "./src",
	format: "esm",
	...(IS_LOCAL ? { env } : {}),
});
