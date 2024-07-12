import { config } from "dotenv";

/**
 *
 * @returns {DotenvParseOutput}
 */
const getConfig = () => {
	return config({
		processEnv:
			process.env.NODE_ENV === "development" ? config().parsed : process.env,
	}).parsed;
};

export default getConfig();
