import { defineConfig } from "tsup";
import env from "~/dotenv.mjs";

// TODO: test if passing env directly is needed
export default defineConfig({
	entry: ["./src/api/**/*.ts", "./src/tools/**/*.ts", "./src/utils/**/*.ts"],
	outDir: "./dist",
	format: ["esm"],
	minify: true,
	sourcemap: true,
	external: ["dayjs"],
	env,
});
