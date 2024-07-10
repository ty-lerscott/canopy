import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Config } from "tailwindcss";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: Config = {
	content: [`${__dirname}/**/*.{ts,tsx,mdx}`],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
};
export default config;
