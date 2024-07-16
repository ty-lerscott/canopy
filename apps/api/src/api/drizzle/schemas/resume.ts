import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const experienceTable = sqliteTable("experiences", {
    id: text('id').primaryKey(),
    role: text('Role'),
    company: text('Company'),
    location: text('Location'),
    workStyle: text('Work Style'),
    startDate: text('Start Date'),
    endDate: text('End Date'),
    body: text('Body', {mode: 'json'}).$type<string[]>(),
});

export const skillsTable = sqliteTable("skills", {
    id: text('id').primaryKey(),
    name: text('Name'),
    endDate: text('End Date'),
    isActive: integer('Is Active', { mode: 'boolean' }),
    startDate: text('Start Date'),
    favorite: integer('Favorite', { mode: 'boolean' }),
    comfortLevel: integer('Comfort Level'),
});

export const resumeTable = sqliteTable("resumes", {
    id: text('id').primaryKey(),
    skills: text('Skills', {mode: 'json'}).$type<string[]>(),
    experiences: text('Experiences', {mode: 'json'}).$type<string[]>()
});
