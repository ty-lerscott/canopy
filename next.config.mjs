import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

// TODO: check if needed now
config();

const IS_LOCAL = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: IS_LOCAL ? ".next" : resolve(__dirname, "src", "apps", ".next"),
	webpack: (config) => {
		config.resolve.alias["@cnpy"] = resolve(__dirname, "src", "apps");
		config.resolve.alias["tailwind.config"] = resolve(
			__dirname,
			"tailwind.config.ts",
		);
		return config;
	},
};

export default nextConfig;
