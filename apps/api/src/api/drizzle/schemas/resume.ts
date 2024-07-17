import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const experienceTable = sqliteTable("experiences", {
	id: text("id").primaryKey(),
	role: text("Role"),
	company: text("Company"),
	endDate: text("End Date"),
	location: text("Location"),
	workStyle: text("Work Style"),
	startDate: text("Start Date"),
	resumeId: text("Resume Id").references(() => resumeTable.id),
	body: text("Body", { mode: "json" }).$type<string[]>(),
});

export const skillsTable = sqliteTable("skills", {
	id: text("id").primaryKey(),
	name: text("Name"),
	endDate: text("End Date"),
	isActive: integer("Is Active", { mode: "boolean" }),
	startDate: text("Start Date"),
	favorite: integer("Favorite", { mode: "boolean" }),
	comfortLevel: integer("Comfort Level"),
	resumeId: text("Resume Id").references(() => resumeTable.id),
});

export const resumeTable = sqliteTable("resumes", {
	id: text("id").primaryKey(),
});

export const resumeSkillRelations = relations(resumeTable, ({ many }) => ({
	skill: many(skillsTable),
}));

export const resumeExperienceRelations = relations(resumeTable, ({ many }) => ({
	experience: many(experienceTable),
}));
