import camelCase from "camelcase-keys";
import educationJson from "./dump/education.json";
import experiencesJson from "./dump/experiences.json";
import resumesJson from "./dump/resumes.json";
import skillsJson from "./dump/skills.json";
import socialsJson from "./dump/socials.json";
import usersJson from "./dump/users.json";
import client from "./client";
import { tables } from "./schema";

const imports = [
	{ json: usersJson, table: tables.users },
	{ json: educationJson, table: tables.education },
	{ json: socialsJson, table: tables.socials },
	{ json: resumesJson, table: tables.resumes },
	{ json: skillsJson, table: tables.skills },
	{ json: experiencesJson, table: tables.experiences },
];

const importDb = async () => {
	for (const thing of imports) {
		await client
			.insert(thing.table)
			.values(camelCase(thing.json as Record<string, unknown>[]))
			.run();
	}
};

(async () => {
	await importDb();
})();
