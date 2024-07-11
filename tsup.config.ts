import { defineConfig } from "tsup";

import { config } from "dotenv";

const IS_LOCAL = process.env.NODE_ENV === "development";

console.log("PROCESS ARGS", process.env.NODE_ENV);
console.log("IS_LOCAL", IS_LOCAL);

config(
	IS_LOCAL
		? {
				path: ".env.local",
			}
		: undefined,
);

console.log("PROCESS ARGS", process.env.NODE_ENV);
console.log("PROCESS ARGS", process.env.DISCORD_WEBHOOK_URL);

export default defineConfig({
	entry: ["./src/(api|tools)/*.ts(x)?"],
	outDir: "./src",
	format: "esm",
	define: {
		"process.env.DISCORD_WEBHOOK_URL": JSON.stringify(
			process.env.DISCORD_WEBHOOK_URL as string,
		),
	},
});
