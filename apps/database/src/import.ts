import camelCase from "camelcase-keys";
import educationJson from "../dist/data/Education data.json";
import experiencesJson from "../dist/data/Experiences (1).json";
import resumesJson from "../dist/data/Resumes (1).json";
import skillsJson from "../dist/data/Skills data.json";
import socialsJson from "../dist/data/Socials data.json";
import usersJson from "../dist/data/Users data.json";
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
