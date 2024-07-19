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
import {
	education,
	experiences,
	resumes,
	skills,
	users,
} from "./schemas/schemas";

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
const resumeId = "e87cfqo0vxvm3rjat4tpdiw4";
const userId = "bt3a07borc0rbuvu630f5zhy";

(async () => {
	for (let i = 1; i <= 20; i++) {
		// const user = generateSkill(resumeId);
		// await db.insert(skills).values(user).run();
		// console.log(user.id);
	}
})();
