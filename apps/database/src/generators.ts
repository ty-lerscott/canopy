import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";
import type {
	Education,
	Experience,
	Skill,
	User,
} from "~/apps/server/src/types/drizzle";

const generateSchoolName = () => {
	const prefix = faker.helpers.arrayElement([
		"North",
		"South",
		"East",
		"West",
		"Central",
	]);
	const name = faker.person.lastName();
	const suffix = faker.helpers.arrayElement([
		"High School",
		"Academy",
		"College",
		"University",
	]);
	return `${prefix} ${name} ${suffix}`;
};

const generateDegreeName = () => {
	const level = faker.helpers.arrayElement([
		"Bachelor of",
		"Master of",
		"Doctor of",
	]);
	const field = faker.helpers.arrayElement([
		"Science in",
		"Arts in",
		"Engineering in",
	]);
	const subject = faker.person.jobType();
	return `${level} ${field} ${subject}`;
};

const generateSkill = (resumeId: string): Skill => {
	return {
		id: createId(),
		isEditable: false,
		name: faker.word.words({ count: { min: 1, max: 3 } }),
		endDate: faker.date.recent().toString(),
		isActive: faker.datatype.boolean(),
		startDate: faker.date.past().toString(),
		favorite: faker.datatype.boolean(),
		comfortLevel: faker.number.int({ min: 0, max: 10 }),
		resumeId,
	};
};

const generateExperience = (resumeId: string): Experience => {
	return {
		id: createId(),
		isEditable: false,
		role: faker.person.jobTitle(),
		company: faker.company.name(),
		location: `${faker.location.city()}, ${faker.location.state()}`,
		workStyle: faker.helpers.arrayElement(["in-office", "hybrid", "remote"]),
		startDate: faker.date.past().toString(),
		endDate: faker.date.recent().toString(),
		body: faker.lorem.paragraphs({
			min: 1,
			max: 5,
		}),
		resumeId,
	};
};

const generateEducation = (userId: string): Education => {
	return {
		userId,
		id: createId(),
		isEditable: false,
		school: generateSchoolName(),
		degree: generateDegreeName(),
		startDate: faker.date.past().toString(),
		endDate: faker.date.recent().toString(),
		major: faker.word.words({ count: { min: 1, max: 3 } }),
	};
};

const generateUser = (): User => {
	return {
		id: createId(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		phoneNumber: faker.phone.number(),
		profession: faker.person.jobTitle(),
		emailAddress: faker.internet.email(),
		displayName: faker.internet.userName(),
		socials: [],
		education: [],
		isEditable: false,
		address: `${faker.location.city()}, ${faker.location.state()}`,
	};
};

export { generateUser, generateEducation, generateExperience, generateSkill };
