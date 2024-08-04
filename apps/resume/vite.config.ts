import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// TODO: check if this module is necessary
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "@dotenvx/dotenvx";

const env = dotenv.config().parsed as Record<string, string>;
const IS_LOCAL = env.APP_ENV === "development";

export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: IS_LOCAL
					? "http://canopy.lerscott.local:3100"
					: "https://canopy.lerscott.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	plugins: [tsconfigPaths(), TanStackRouterVite(), react()],
});
