import dotenv from "dotenv";
import { defineConfig } from "tsup";

const env = dotenv.config().parsed;

export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts"],
	outDir: "./src",
	format: "esm",
	env,
	define: {
		"process.env.PORT": JSON.stringify(process.env.PORT || 3000),
		"process.env.BLUR": JSON.stringify(process.env.BLUR || 10),
		"process.env.APP_ENV": JSON.stringify(process.env.APP_ENV || "production"),
		"process.env.NODE_ENV": JSON.stringify(
			process.env.NODE_ENV || "production",
		),
		"process.env.DISCORD_WEBHOOK_URL": JSON.stringify(
			process.env.DISCORD_WEBHOOK_URL,
		),
	},
});
