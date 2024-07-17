export type Experience = {
	id: string;
	role: string;
	company: string;
	location: string;
	workStyle?: "in-office" | "hybrid" | "remote";
	startDate: string;
	endDate?: string;
	body: string[];
};

export type Skill = {
	id: string;
	name: string;
	endDate?: string;
	isActive: boolean;
	startDate: string;
	favorite: boolean;
	comfortLevel: number;
};

export type Education = {
	id: string;
	school: string;
	degree: string;
	startDate: string;
	endDate?: string;
};

export type User = {
	id: string;
	address: string;
	firstName: string;
	lastName: string;
	profession: string;
	phoneNumber: string;
	emailAddress: string;
};
