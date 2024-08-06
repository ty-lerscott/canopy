import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		host: "resume.lerscott.local",
	},
	plugins: [tsconfigPaths(), TanStackRouterVite(), react()],
});
