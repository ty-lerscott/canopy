import dotenv from "dotenv";
import { defineConfig } from "tsup";

dotenv.config();

export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts"],
	outDir: "./src",
	format: "esm",
	env: {
		BLUR: process.env.BLUR || "10",
		PORT: process.env.PORT || "3000",
		APP_ENV: process.env.APP_ENV || "production",
		NODE_ENV: process.env.NODE_ENV || "production",
		DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || "",
	},
});
