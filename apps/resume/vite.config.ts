import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		proxy: {
			"/resume": "http://canopy.lerscott.local:3100",
		},
	},
	plugins: [tsconfigPaths(), TanStackRouterVite(), react()],
});
