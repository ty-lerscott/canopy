import {resolve} from 'node:path';
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import {config as dotenvConfig} from '@dotenvx/dotenvx';
import {userTable, educationTable} from './schemas/user';
import {skillsTable, experienceTable} from './schemas/resume';
import {generateUser, generateEducation, generateExperience, generateSkill} from './generators';

const databasePath = resolve(process.cwd(), '..', 'database');

const env = dotenvConfig({
    path: resolve(databasePath, '.env'),
}).parsed || {};

const client = createClient({
    url: "http://localhost:8080",
    authToken: env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

const educationIds = [ "d2wip4mg0mitlzwovdgz3wzk", "m5ixl36kzyk59z4eafhrd7ma" ];
const experiences = ["ak2fp8vzb0i5a8sznoh0c4jk",
    "fmc1pz8dq8e2gxgjap3w03kh",
    "gt3ljv3of7bhpua9okavvwdx",
    "hpdvujl1mkyf2idulhu7hbhs",
    "odgte7hg8d17pcpreylb7sgk",
    "q9wz3j9n36je97wb8pjkdiza",
    "xd7zaylj1q1az2kcrrz9a3ic"];

const skills = ["aj94zb56hqhutmzaoc5v3tfh",
    "lvucw41eabc3t0ndmt1pkf6y",
    "nk2wnbq8n4u4wyjh2vv3tam0",
    "qwd0q69ib3hzthbi81cjogog",
    "tcshzyyf0zmq6p9us0j5sozd",
    "xijfk1t9x2x3y7qm2magzdfl"];

(async () => {
    // await db.insert(educationTable).values(generateEducation()).run()
    // await db.insert(educationTable).values(generateEducation()).run()
})()