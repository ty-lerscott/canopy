import env from "@/tools/dotenv-config.mjs";
import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts"],
	outDir: "./src",
	format: "esm",
	minify: true,
	sourcemap: true,
	// dts: true
	env,
});
