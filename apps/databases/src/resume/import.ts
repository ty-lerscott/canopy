import camelCase from "camelcase-keys";
import educationJson from "~/apps/databases/src/resume/dump/education.json";
import experiencesJson from "~/apps/databases/src/resume/dump/experiences.json";
import resumesJson from "~/apps/databases/src/resume/dump/resumes.json";
import skillsJson from "~/apps/databases/src/resume/dump/skills.json";
import socialsJson from "~/apps/databases/src/resume/dump/socials.json";
import usersJson from "~/apps/databases/src/resume/dump/users.json";
import client from "./client";
import { tables } from "./schemas";

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
