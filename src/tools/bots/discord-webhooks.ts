import type { Level, Message, User as UserType } from "@/types/bots";
import { program } from "commander";
import merge from "deepmerge";
import { MessageBuilder, Webhook } from "discord-webhook-node";
import omit from "object.omit";

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
console.log(
	"HELLO WORLD",
	process.env.DISCORD_WEBHOOK_URL ===
		"https://discord.com/api/webhooks/1260671221453033623/ZFLliap4q9pAIs-hfXbuZit3vi4PM5QfRrvXY719KS5LT2mLjYhu0Ard5zU-zG7kb_p2",
);
const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL as string);

const wrap = (message: string, level: Level) => {
	const fixture = FIXTURE[level];

	return `${fixture} ${message} ${fixture}`;
};
const sendMessage = async (message: Message) => {
	const { url, user, fields, title, image, footer, description, level } =
		merge<Message>(DEFAULT_MESSAGE, message);

	let embed = new MessageBuilder()
		.setTimestamp()
		.setColor(LEVEL[level as Level] as unknown as number);

	if (user) {
		embed.setAuthor(user.name, user.avatar, user.url);
	}

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
		.option("--user.url, <string>")
		.option("--user.name, <string>")
		.option("--user.avatar, <string>")
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
				...props
			}: {
				field?: string;
				footer?: string;
				dryRun?: boolean;
				props: Record<string, string>;
			}) => {
				// @ts-ignore
				const flags = omit(props, ["user.name", "user.avatar", "user.url"]);
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

				const userName = (props as unknown as Record<"user.name", string>)[
					"user.name"
				];
				const userAvatar = (props as unknown as Record<"user.avatar", string>)[
					"user.avatar"
				];
				const userUrl = (props as unknown as Record<"user.url", string>)[
					"user.url"
				];

				const user = userName
					? {
							url: userUrl,
							name: userName,
							avatar: userAvatar,
						}
					: undefined;
				const [footerValue, footerImage] = footer ? separate(footer) : [];

				const message = merge<Message>(DEFAULT_MESSAGE, {
					...flags,
					fields,
					...(user && { user }),
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
