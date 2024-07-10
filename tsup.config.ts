import { defineConfig } from "tsup";

import { config } from "dotenv";

console.log("PROCESS ARGS", process.env.NODE_ENV);
console.log("PROCESS ARGS", process.env.DISCORD_WEBHOOK_URL);

const env = config({
	path: ".env.local",
}).parsed;

export default defineConfig({
	entry: ["./src/(api|tools)/*.ts(x)?"],
	outDir: "./src",
	format: "esm",
	env,
});
