import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: ".next",
	webpack: (config) => {
		config.resolve.alias["@/"] = resolve(__dirname, "src");
		config.resolve.alias["tailwind.config"] = resolve(
			__dirname,
			"tailwind.config.ts",
		);
		config.resolve.alias["postcss.config"] = resolve(
			__dirname,
			"postcss.config.ts",
		);
		return config;
	},
};

export default nextConfig;
