import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/api/server.ts"],
	outDir: "./src/api",
	format: "esm",
});
