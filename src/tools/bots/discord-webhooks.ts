import type { Bot, Level, Message } from "@/types/bots";
import { program } from "commander";
import merge from "deepmerge";
import { MessageBuilder, Webhook } from "discord-webhook-node";

const LEVEL = {
	info: "#1982c4",
	notice: "#6a4c93",
	success: "#8ac926",
	warning: "#ffca3a",
	critical: "#ff595e",
} as Record<Level, string>;

const FIXTURE = {
	info: "💡",
	notice: "📢",
	success: "🎉",
	warning: "☢",
	critical: "🚨",
} as Record<Level, string>;

const DEFAULT_MESSAGE = {
	level: "info",
} as Message;

const BotUser: Bot = {
	name: "Captain Hook",
	url: "https://canopy.lerscott.com",
	webhook: process.env.DISCORD_WEBHOOK_URL as string,
	avatar: "https://canopy.lerscott.com/images/bots/captain-hook.png",
};

console.log({ BotUser });

const hook = new Webhook(BotUser.webhook);

const wrap = (message: string, level: Level) => {
	const fixture = FIXTURE[level];

	return `${fixture} ${message} ${fixture}`;
};
const sendMessage = async (message: Message) => {
	const { url, fields, title, image, footer, description, level } =
		merge<Message>(DEFAULT_MESSAGE, message);

	let embed = new MessageBuilder()
		.setAuthor(BotUser.name, BotUser.avatar, BotUser.url)
		.setTimestamp()
		.setColor(LEVEL[level as Level] as unknown as number);

	if (title) {
		embed = embed.setTitle(wrap(title, level as Level));
	}

	if (description) {
		embed = embed.setDescription(
			title ? description : wrap(description, level as Level),
		);
	}

	if (url) {
		// @ts-ignore
		embed = embed.setURL(url);
	}

	if (Array.isArray(fields) && fields.length) {
		for (const field of fields) {
			embed = embed.addField(field.name, field.value, field.isInline);
		}
	}

	if (image) {
		embed = embed.setImage(image);
	}

	if (footer) {
		embed = embed.setFooter(footer.value, footer.image);
	}

	return hook.send(embed);
};
const separate = (str: string) => str.split("%");
const collect = (value: string, arr: string[]): string[] => arr.concat([value]);

const Program = () => {
	program
		.option("-u, --url, <string>")
		.option("-dry, --dry-run")
		.option("-l, --level, <string>")
		.option("-t, --title, <string>")
		.option("-i, --image, <string>")
		.option("-d, --description, <string>")
		.option("--footer, <string>%<string>")
		.option(
			"-f, --field, <string>%<string>%<string>",
			"Collect Args",
			collect,
			[],
		)
		.action(
			async ({
				field,
				dryRun,
				footer,
				...flags
			}: {
				field?: string;
				footer?: string;
				dryRun?: boolean;
			}) => {
				const fields = Array.isArray(field)
					? field.map((item) => {
							const [name, value, isInline] = separate(item);

							return {
								name,
								value,
								isInline: Boolean(isInline),
							};
						})
					: undefined;
				const [footerValue, footerImage] = footer ? separate(footer) : [];

				const message = merge<Message>(DEFAULT_MESSAGE, {
					...flags,
					fields,
					...(footerValue && {
						footer: {
							value: footerValue,
							image: footerImage,
						},
					}),
				});

				if (dryRun) {
					console.log(message);
				} else {
					await sendMessage(message);
				}
			},
		);

	program.parse();
};

export default Program;
