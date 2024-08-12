import client from "./client";
import { sql } from "drizzle-orm/sql";

const TABLES = ['users', 'socials', 'skills', 'experiences', 'education', 'resumes']

const clearDB = async () => {
    for (const table of TABLES) {
        await client.run(sql`DELETE TABLE ${table}`);
    }
};

(async () => {
    await clearDB();
})();
