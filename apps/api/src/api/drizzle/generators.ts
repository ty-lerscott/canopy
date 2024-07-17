import type { Education, Experience, Skill, User } from "@/types/drizzle";
import { faker } from "@faker-js/faker";
import { createId } from "@paralleldrive/cuid2";

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

const generateSkill = (resumeId: string): Skill & { resumeId: string } => {
	return {
		id: createId(),
		name: faker.word.words({ count: { min: 1, max: 3 } }),
		endDate: faker.date.recent().toString(),
		isActive: faker.datatype.boolean(),
		startDate: faker.date.past().toString(),
		favorite: faker.datatype.boolean(),
		comfortLevel: faker.number.int({ min: 0, max: 10 }),
		resumeId,
	};
};

const generateExperience = (
	resumeId: string,
): Experience & { resumeId: string } => {
	return {
		id: createId(),
		role: faker.person.jobTitle(),
		company: faker.company.name(),
		location: `${faker.location.city()}, ${faker.location.state()}`,
		workStyle: faker.helpers.arrayElement([
			"in-office",
			"hybrid",
			"remote",
			undefined,
		]),
		startDate: faker.date.past().toString(),
		endDate: faker.date.recent().toString(),
		body: faker.lorem
			.paragraphs({
				min: 1,
				max: 5,
			})
			.split("\n"),
		resumeId,
	};
};

const generateEducation = (userId: string): Education & { userId: string } => {
	return {
		id: createId(),
		school: generateSchoolName(),
		degree: generateDegreeName(),
		startDate: faker.date.past().toString(),
		endDate: faker.date.recent().toString(),
		userId,
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
		address: `${faker.location.city()}, ${faker.location.state()}`,
	};
};

export { generateUser, generateEducation, generateExperience, generateSkill };
