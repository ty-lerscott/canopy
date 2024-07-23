import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		proxy: {
			"/api": {
				target: "http://canopy.lerscott.local:3100",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	plugins: [tsconfigPaths(), TanStackRouterVite(), react()],
});
