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
console.log(
	"MATCH",
	process.env.DISCORD_WEBHOOK_URL ===
		"https://discord.com/api/webhooks/1260671221453033623/ZFLliap4q9pAIs-hfXbuZit3vi4PM5QfRrvXY719KS5LT2mLjYhu0Ard5zU-zG7kb_p2",
);

export default defineConfig({
	entry: ["./src/(api|tools)/*.ts(x)?"],
	outDir: "./src",
	format: "esm",
	define: {
		"process.env.DISCORD_WEBHOOK_URL": process.env.DISCORD_WEBHOOK_URL
			? JSON.stringify(process.env.DISCORD_WEBHOOK_URL as string)
			: "",
	},
});
