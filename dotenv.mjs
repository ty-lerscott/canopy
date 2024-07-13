import * as dotenv from "dotenv";
dotenv.config(
	process.env.NODE_ENV !== "development"
		? {
				processEnv: process.env,
			}
		: undefined,
);
