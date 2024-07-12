import env from "@/tools/dotenv-config.mjs";
import { defineConfig } from "tsup";

console.log("DISCORD_WEBHOOK_URL");
console.log(
	env.DISCORD_WEBHOOK_URL ===
		"https://discord.com/api/webhooks/1260671221453033623/ZFLliap4q9pAIs-hfXbuZit3vi4PM5QfRrvXY719KS5LT2mLjYhu0Ard5zU-zG7kb_p2",
);
console.log("DISCORD_WEBHOOK_URL");

export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts", "./src/utils/**/*.ts"],
	outDir: "./src",
	format: "esm",
	minify: true,
	sourcemap: true,
	external: ["dayjs"],
	env: {
		BLUR: process.env.BLUR || "10",
		PORT: process.env.PORT || "3000",
		API_KEY: process.env.API_KEY || "",
		APP_ENV: process.env.APP_ENV || "production",
		NODE_ENV: process.env.NODE_ENV || "production",
		SENTRY_URL: process.env.SENTRY_URL || "",
		SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || "",
		DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || "",
	},
});
