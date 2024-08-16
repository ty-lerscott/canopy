import { relations } from "drizzle-orm";
import {
	education,
	experiences,
	resumes,
	skills,
	socials,
	users,
} from "./tables";

export const userRelations = relations(users, ({ many, one }) => ({
	resumes: many(resumes),
	education: many(education),
	socials: many(socials),
}));

export const resumesRelations = relations(resumes, ({ one, many }) => ({
	user: one(users, {
		fields: [resumes.userId],
		references: [users.id],
	}),
	experiences: many(experiences),
	skills: many(skills),
}));

export const educationRelations = relations(education, ({ one }) => ({
	user: one(users, {
		fields: [education.userId],
		references: [users.id],
	}),
}));

export const socialsRelations = relations(socials, ({ one }) => ({
	user: one(users, {
		fields: [socials.userId],
		references: [users.id],
	}),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
	resume: one(resumes, {
		fields: [experiences.resumeId],
		references: [resumes.id],
	}),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
	resume: one(resumes, {
		fields: [skills.resumeId],
		references: [resumes.id],
	}),
}));
