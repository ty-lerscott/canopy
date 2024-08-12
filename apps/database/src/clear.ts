import client from "./client";
import { tables } from "./schema";

const TABLES = [tables.skills, tables.experiences, tables.education, tables.resumes, tables.socials, tables.users];

const clearDB = async () => {
    for (const table of TABLES) {
        await client.delete(table)
    }
};

(async () => {
    await clearDB();
})();
