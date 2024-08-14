export type Experience = {
	id: string;
	role: string;
	company: string;
	location: string;
	workStyle: "in-office" | "hybrid" | "remote";
	startDate: string;
	endDate?: string;
	body: string;
	isEditable: boolean;
	resumeId: string;
};

export type Skill = {
	id: string;
	name: string;
	endDate?: string;
	isActive: boolean;
	startDate: string;
	favorite: boolean;
	comfortLevel: number;
	isEditable: boolean;
	resumeId: string;
};

export type Education = {
	id: string;
	school: string;
	major: string;
	degree: string;
	startDate: string;
	endDate?: string;
	userId: string;
	isEditable: boolean;
};

export type Social = {
	id: string;
	name: string;
	href: string;
	isEditable: boolean;
};

export type UserProfile = {
	address: string;
	firstName: string;
	lastName: string;
	socials: Social[];
	profession: string;
	displayName: string;
	phoneNumber: string;
	emailAddress: string;
	education: Education[];
};

export type User = UserProfile & {
	id: string;
	isEditable: boolean;
};

export type Resume = {
	id: string;
	user: User;
	name: string;
	userId: string;
	skills: Skill[];
	isEditable: boolean;
	experiences: Experience[];
	professionalSummary: string;
};
