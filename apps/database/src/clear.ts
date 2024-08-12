import client from "./client";
import { tables } from "./schema";
import type { SQLiteTable} from "drizzle-orm/sqlite-core";

const clearDB = async () => {
    for (const table of tables as unknown as SQLiteTable[]) {
        await client.delete(table)
    }
};

(async () => {
    await clearDB();
})();
