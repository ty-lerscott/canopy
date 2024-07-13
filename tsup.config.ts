import { defineConfig } from "tsup";
import config from "~/dotenv.mjs";

console.log(config);

// TODO: test if passing env directly is needed
export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts", "./src/utils/**/*.ts"],
	outDir: "./dist",
	format: ["esm"],
	minify: true,
	sourcemap: true,
	external: ["dayjs"],
	env: config,
});
