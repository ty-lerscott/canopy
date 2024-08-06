import {config as envConfig} from "@dotenvx/dotenvx";
import {readFileSync} from "node:fs";
import {resolve} from "node:path";

const getEnv = (pathname: string) => {
    return envConfig({
        processEnv: readFileSync(resolve(pathname, ".env"), 'utf-8').split('\n').reduce((acc, line) => {
            const [key, value] = line.split('=');

            acc[key] = value;

            return acc;
        }, {} as Record<string, string>),
    }).parsed || {}
}

export default getEnv;