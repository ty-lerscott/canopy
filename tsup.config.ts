import { defineConfig } from "tsup";

import { config } from "dotenv";

const env = config({
	path: ".env.local",
}).parsed;

export default defineConfig({
	entry: ["./src/(api|tools)/*.ts(x)?"],
	outDir: "./src",
	format: "esm",
	env,
});
