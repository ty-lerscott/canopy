import type { Level, Message } from "@/types/bots";
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

const DEFAULT_MESSAGE = {
	level: "info",
} as Message;
const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL as string);

const sendMessage = async (message: Message) => {
	const { url, author, fields, title, image, footer, description, level } =
		merge<Message>(DEFAULT_MESSAGE, message);

	let embed = new MessageBuilder()
		.setTimestamp()
		.setColor(LEVEL[level as Level] as unknown as number);

	if (author) {
		embed.setAuthor(author.name, author.avatar, author.url);
	}

	if (title) {
		embed = embed.setTitle(title);
	}

	if (description) {
		embed = embed.setDescription(description);
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
		.option("--author.url, <string>")
		.option("--author.name, <string>")
		.option("--author.avatar, <string>")
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
				const flags = omit(props, [
					"author.name",
					"author.avatar",
					"author.url",
				]);
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

				const authorName = (props as unknown as Record<"author.name", string>)[
					"author.name"
				];
				const authorAvatar = (
					props as unknown as Record<"author.avatar", string>
				)["author.avatar"];
				const authorUrl = (props as unknown as Record<"author.url", string>)[
					"author.url"
				];

				const author = authorName
					? {
							url: authorUrl,
							name: authorName,
							avatar: authorAvatar,
						}
					: undefined;
				const [footerValue, footerImage] = footer ? separate(footer) : [];

				const message = merge<Message>(DEFAULT_MESSAGE, {
					...flags,
					fields,
					...(author && { author }),
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
