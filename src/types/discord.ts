export type Level = "info" | "notice" | "success" | "warning" | "critical";

export type User = {
	url: string;
	name: string;
	avatar: string;
};

type Field = {
	name: string;
	value: string;
	isInline?: boolean;
};

export type Message = {
	url?: string;
	author?: User;
	level?: Level;
	title?: string;
	image?: string;
	fields?: Field[];
	description?: string;
	footer?: {
		value: string;
		image?: string;
	};
};
