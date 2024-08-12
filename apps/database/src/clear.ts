import client from "./client";
import { sql } from "drizzle-orm/sql";

const TABLES = ['users', 'socials', 'skills', 'experiences', 'education', 'resumes']

const clearDB = async () => {
    for (const table of TABLES) {
        const query = `DELETE FROM ${table}`;

        await client.run(sql`${query}`);
    }
};

(async () => {
    await clearDB();
})();
