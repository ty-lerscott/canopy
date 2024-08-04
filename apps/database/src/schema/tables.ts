import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").primaryKey().$defaultFn(createId),
	address: text("Address"),
	lastName: text("Last Name"),
	firstName: text("First Name"),
	profession: text("Profession"),
	displayName: text("Display Name"),
	emailAddress: text("Email Address"),
	phoneNumber: integer("Phone Number"),
});

export const resumes = sqliteTable("resumes", {
	id: text("id").primaryKey().$defaultFn(createId),
	name: text("Name"),
	userId: text("User Id").references(() => users.id),
});

export const experiences = sqliteTable("experiences", {
	id: text("id").primaryKey().$defaultFn(createId),
	role: text("Role"),
	company: text("Company"),
	endDate: text("End Date"),
	location: text("Location"),
	workStyle: text("Work Style"),
	startDate: text("Start Date"),
	resumeId: text("Resume Id").references(() => resumes.id),
	body: text("Body"),
});

export const skills = sqliteTable("skills", {
	id: text("id").primaryKey().$defaultFn(createId),
	name: text("Name"),
	endDate: text("End Date"),
	isActive: integer("Is Active", { mode: "boolean" }),
	startDate: text("Start Date"),
	favorite: integer("Favorite", { mode: "boolean" }),
	comfortLevel: integer("Comfort Level"),
	resumeId: text("Resume Id").references(() => resumes.id),
});

export const education = sqliteTable("education", {
	id: text("id").primaryKey().$defaultFn(createId),
	school: text("School"),
	degree: text("Degree"),
	major: text("Major"),
	startDate: text("Start Date"),
	endDate: text("End Date"),
	userId: text("User Id").references(() => users.id),
});

export const socials = sqliteTable("socials", {
	id: text("id").primaryKey().$defaultFn(createId),
	name: text("Name"),
	href: text("Href"),
	userId: text("User Id").references(() => users.id),
});
