// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import { resolve } from "path";
import run from "@rollup/plugin-run";
import typescript from "@rollup/plugin-typescript";

const dev = process.env.ROLLUP_WATCH === "true";

const config = {
	input: {
		api: "./src/api/index.ts",
	},
	output: {
		dir: "./dist",
		format: "esm",
		sourcemap: true,
	},
	watch: {
		include: resolve("**", "*.[jt]s(x)?"),
		exclude: resolve("node_modules", "**", "*.[jt]s(x)?"),
		chokidar: {
			usePolling: true,
		},
	},
	plugins: [typescript()].concat(dev ? [run()] : []),
	external: ["express"],
};

export default config;
