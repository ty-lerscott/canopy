import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import type {Education} from '@/types/drizzle';

export const educationTable = sqliteTable("education", {
    id: text('id').primaryKey(),
    school: text('School'),
    degree: text('Degree'),
    startDate: text('Start Date'),
    endDate: text('End Date'),
});

export const userTable = sqliteTable("users", {
    id: text('id').primaryKey(),
    address: text('Address'),
    lastName: text('Last Name'),
    firstName: text('First Name'),
    profession: text('Profession'),
    emailAddress: text('Email Address'),
    phoneNumber: integer('Phone Number'),
    education: text('Education', {mode: 'json'}).$type<Education[]>(),
    resumes: text('Resumes', {mode: 'json'}).$type<string[]>(),
});
