import { resolve } from "node:path";
import {config as envConfig} from "@dotenvx/dotenvx";
import getPackageJson from "../utils/get-package-json";

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

    return {
        env,
        args: "start",
        cwd: serverDir,
        script: "pnpm",
        instances: "1",
        exec_mode: "fork",
        name: `@${rootPkg.name}/${serverPkg.name}`,
        ignore_watch: ["node_modules", "logs", "src"],
    };
}

export default generateConfig;