import { defineConfig } from "tsup";
import env from "@/lib/dotenv.mjs";

export default defineConfig({
	entry: ["./src/**/*.(ts|mjs)"],
	outDir: "./dist",
	format: ["esm"],
	minify: true,
	sourcemap: true,
	external: ["dayjs"],
	env,
});
