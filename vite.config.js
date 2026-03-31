import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	root: "frontend",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "frontend/src"),
		},
	},
	build: {
		outDir: "../public",
		emptyOutDir: true,
	},
	server: {
		port: 5173,
		proxy: {
			"/api": "http://localhost:3000",
			"/health": "http://localhost:3000",
		},
	},
});
