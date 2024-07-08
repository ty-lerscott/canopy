import { resolve } from "node:path";
import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";

const config = {
	entryPoints: ["src/server.ts"],
	outdir: "dist",
	bundle: true,
	minify: true,
	platform: "node",
	target: "node20",
	format: "esm",
	sourcemap: true,
	inject: [resolve(process.cwd(), "esbuild", "cjs-shim.ts")],
	plugins: [TsconfigPathsPlugin({ tsconfig: "./tsconfig.json" })],
	external: ["node_modules/*"],
};

export default config;
