const { resolve } = require("node:path");
const dotenvConfig = require("@dotenvx/dotenvx").config;
const getPackageJson = require("./utils/get-package-json");

const IS_TURBO = Boolean(process.env.TURBO_HASH);

const cwd = process.cwd();
const serverDir = resolve(cwd, "..", "apps", "server");
const rootPkg = getPackageJson(resolve(cwd, ".."));
const apiPkg = getPackageJson(serverDir);

const apiEnv =
	dotenvConfig({
		path: resolve(serverDir, ".env"),
	}).parsed || {};

const config = {
	apps: [
		{
			name: `@${rootPkg.name}/${apiPkg.name}`,
			cwd: serverDir,
			script: "pnpm",
			args: "start",
			instances: "1",
			exec_mode: "fork",
			env: {
				...apiEnv,
				NODE_ENV: "production",
				APP_ENV: "production",
			},
			ignore_watch: ["node_modules", "logs", "src"],
		},
	],
};

module.exports = config;
