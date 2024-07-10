export type Level = "info" | "notice" | "success" | "warning" | "critical";

export type Bot = {
	url: string;
	name: string;
	avatar: string;
	webhook: string;
};

type Field = {
	name: string;
	value: string;
	isInline?: boolean;
};

export type Message = {
	url?: string;
	fields?: Field[];
	level?: Level;
	title?: string;
	image?: string;
	description?: string;
	footer?: {
		value: string;
		image?: string;
	};
};
