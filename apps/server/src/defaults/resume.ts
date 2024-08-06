import type { Resume } from "@/types/drizzle";

const DEFAULT_RESUME: Resume = {
	id: "",
	name: '',
	userId: "",
	user: {
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
	},
	skills: [],
	experiences: [],
	isEditable: false,
};

export default DEFAULT_RESUME;
