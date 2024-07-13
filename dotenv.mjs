import { config } from "@dotenvx/dotenvx";

const configVars = config();

export default configVars.parsed || {};
