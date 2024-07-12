import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createId } from "@paralleldrive/cuid2";
import { config } from "dotenv";

const env = config().parsed as Record<string, string>;

const envPath = resolve(process.cwd(), ".env");

const defaultConfig = readFileSync(envPath, "utf-8")
	.split("\n")
	.reduce(
		(envVarAcc, line) => {
			const [envVar] = line.split("=");

			envVarAcc[envVar] = envVar === "API_KEY" ? createId() : env[envVar];

			return envVarAcc;
		},
		{} as Record<string, string>,
	);

const asPlainObject = Object.entries(defaultConfig)
	.reduce((acc, [key, value]) => {
		acc.push(`${key}=${value}`);
		return acc;
	}, [] as string[])
	.join("\n");

writeFileSync(envPath, asPlainObject, "utf-8");
