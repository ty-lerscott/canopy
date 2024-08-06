import { resolve } from "node:path";
import {config as envConfig} from "@dotenvx/dotenvx";
import getPackageJson from "../utils/get-package-json";

const DEBUG = process.env.DEBUG === 'true';

const generateConfig = (appDir: string) => {
    if (!appDir) {
        return {}
    }

    const cwd = process.cwd();
    const serverDir = resolve(cwd, "..", "..", appDir);
    const rootPkg = getPackageJson(resolve(cwd, "..", ".."));
    const serverPkg = getPackageJson(serverDir);

    const env =
        envConfig({
            path: resolve(serverDir, ".env"),
        }).parsed || {};

    const config = {
        env,
        args: "start",
        cwd: serverDir,
        script: "node ./dist/index.js",
        instances: "1",
        exec_mode: "fork",
        name: `@${rootPkg.name}/${serverPkg.name}`,
        ignore_watch: ["node_modules", "logs", "src"],
    }

    if (DEBUG){
        console.log(config)
    }

    return config;
}

export default generateConfig;