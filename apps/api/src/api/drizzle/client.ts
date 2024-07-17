import { resolve } from "node:path";
import { config as dotenvConfig } from "@dotenvx/dotenvx";
import { createClient } from "@libsql/client";
import { createId } from "@paralleldrive/cuid2";
import { drizzle } from "drizzle-orm/libsql";
import {
	generateEducation,
	generateExperience,
	generateSkill,
	generateUser,
} from "./generators";
import { experienceTable, resumeTable, skillsTable } from "./schemas/resume";
import { educationTable, userTable } from "./schemas/user";

const databasePath = resolve(process.cwd(), "..", "database");

const env =
	dotenvConfig({
		path: resolve(databasePath, ".env"),
	}).parsed || {};

const client = createClient({
	url: "http://localhost:8080",
	authToken: env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);
const resumeId = "fq79nwv7eu20b1ff02sz30j0";
const userId = "aho1bnzhrw6eoz1dvwji8v3h";

(async () => {
	// for (let i = 1; i <= 2; i++) {
	// 	// const experience = generateEducation(userId);
	//
	// 	// await db.insert(educationTable).values(experience).run();
	// }
})();
