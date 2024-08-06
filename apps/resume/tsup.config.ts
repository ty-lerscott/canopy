import { defineConfig } from "tsup";
import {config} from '@dotenvx/dotenvx';

const env = config().parsed as Record<string, string>;

export default defineConfig({
    entry: ["./src/server/index.ts"],
    outDir: "./dist/server",
    format: ["esm"],
    minify: true,
    sourcemap: true,
    env: {
        ...env,
        NODE_ENV: "production",
    },
});
