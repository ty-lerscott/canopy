import discord from "@/tools/bots/discord";
import type { GHDeploymentAction } from "@/types/github";
import dayjs from "dayjs";

// biome-ignore lint/suspicious/noExplicitAny: For any action with "created" the request body can be anything
const CreatedController = async (body: Record<string, any>): Promise<void> => {
	if (body.deployment_status) {
		const {
			repository,
			deployment_status: { state, creator, description, created_at },
		} = body as GHDeploymentAction;
		const level = state === "success" ? "success" : "critical";

		await discord({
			level,
			url: repository.url,
			title: `${repository.name} ${description}`,
			author: {
				url: creator.url,
				name: creator.login,
				avatar: creator.avatar_url,
			},
			fields: [
				{
					name: "Deployed At",
					value: dayjs(created_at).format("DD-MM-YYYY HH:mm:ss"),
				},
			],
		});
		return;
	}

	console.group("UNHANDLED CREATE ACTION");
	console.log(body);
	console.groupEnd();
};

export default CreatedController;
