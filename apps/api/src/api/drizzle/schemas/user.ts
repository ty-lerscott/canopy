import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const educationTable = sqliteTable("education", {
	id: text("id").primaryKey(),
	school: text("School"),
	degree: text("Degree"),
	startDate: text("Start Date"),
	endDate: text("End Date"),
	userId: text("User Id").references(() => userTable.id),
});

export const userTable = sqliteTable("users", {
	id: text("id").primaryKey(),
	address: text("Address"),
	lastName: text("Last Name"),
	firstName: text("First Name"),
	profession: text("Profession"),
	emailAddress: text("Email Address"),
	phoneNumber: integer("Phone Number"),
});

export const userEducationRelations = relations(userTable, ({ many }) => ({
	education: many(educationTable),
}));
