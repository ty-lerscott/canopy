import { config } from "dotenv";

/**
 * @returns {DotenvParseOutput}
 */
const getConfig = () => {
	const configObj = config({
		processEnv:
			process.env.NODE_ENV === "development" ? config().parsed : process.env,
	});

	return configObj.parsed;
};

export default getConfig();
