import type { User } from "@/types/drizzle";

const DEFAULT_USER: User = {
	id: "",
	address: "",
	socials: [],
	firstName: "",
	lastName: "",
	education: [],
	profession: "",
	displayName: "",
	phoneNumber: "",
	emailAddress: "",
	isEditable: false,
};

export default DEFAULT_USER;
