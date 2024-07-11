import dotenv from "dotenv";
import { defineConfig } from "tsup";

const env = dotenv.config().parsed;
const IS_LOCAL =
	env?.NODE_ENV === "development" || process.env.NODE_ENV === "development";

export default defineConfig({
	entry: ["./src/api/*.ts", "./src/tools/*.ts"],
	outDir: "./src",
	format: "esm",
	...(IS_LOCAL ? { env } : {}),
});
