import dotenv from "dotenv";
import { defineConfig } from "tsup";

const env = dotenv.config().parsed;
const IS_LOCAL =
	env?.NODE_ENV === "development" || process.env.NODE_ENV === "development";

export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts"],
	outDir: "./src",
	format: "esm",
	env,
	define: {
		"process.env.PORT": JSON.stringify(process.env.PORT),
		"process.env.BLUR": JSON.stringify(process.env.BLUR),
		"process.env.APP_ENV": JSON.stringify(process.env.APP_ENV),
		"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
		"process.env.DISCORD_WEBHOOK_URL": JSON.stringify(
			process.env.DISCORD_WEBHOOK_URL,
		),
	},
});
