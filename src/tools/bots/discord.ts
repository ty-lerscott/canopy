import type { Level, Message } from "@/types/discord";
import { MessageBuilder, Webhook } from "discord-webhook-node";
import { config } from "dotenv";

config();

const LEVEL = {
	info: "#1982c4",
	notice: "#6a4c93",
	success: "#8ac926",
	warning: "#ffca3a",
	critical: "#ff595e",
} as Record<Level, string>;

const FIXTURE = {
	info: "i",
	notice: "🔔",
	success: "🌟",
	warning: "🚧",
	critical: "🚨",
} as Record<Level, string>;

const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL as string);
const prefixTitle = (title: string, level: Level) => {
	const fixture = FIXTURE[level];
	return `${fixture} ${title} ${fixture}`;
};
const sendMessage = async ({
	url,
	author,
	fields,
	title,
	image,
	footer,
	description,
	level = "info",
}: Message) => {
	const embed = new MessageBuilder()
		.setTimestamp()
		.setColor(LEVEL[level as Level] as unknown as number);

	if (author) {
		embed.setAuthor(author.name, author.avatar, author.url);
	}

	if (title) {
		embed.setTitle(prefixTitle(title, level));
	}

	if (description) {
		embed.setDescription(description);
	}

	if (url) {
		// @ts-ignore
		embed.setURL(url);
	}

	if (fields?.length) {
		for (const field of fields) {
			embed.addField(field.name, field.value, field.isInline);
		}
	}

	if (image) {
		embed.setImage(image);
	}

	if (footer) {
		embed.setFooter(footer.value, footer.image);
	}

	return hook.send(embed);
};

const Bot = async (message: Message) => {
	message.level = message.level || "info";

	console.dir({ message }, { depth: null });
	await sendMessage(message);
};

export default Bot;
