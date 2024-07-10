import { defineConfig } from "tsup";

import { config } from "dotenv";

const IS_LOCAL = process.env.NODE_ENV === "development";

console.log("PROCESS ARGS", process.env.NODE_ENV);
console.log("IS_LOCAL", IS_LOCAL);

const env = config(
	IS_LOCAL
		? {
				path: ".env.local",
			}
		: undefined,
).parsed;

console.log("PROCESS ARGS", process.env.NODE_ENV);
console.log("PROCESS ARGS", process.env.DISCORD_WEBHOOK_URL);
console.log("PROCESS ARGS", env);

export default defineConfig({
	entry: ["./src/(api|tools)/*.ts(x)?"],
	outDir: "./src",
	format: "esm",
	env,
});
