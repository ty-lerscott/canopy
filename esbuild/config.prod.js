import { build } from "esbuild";

import config from "./config.shared.js";

build(config).catch(() => process.exit(1));
