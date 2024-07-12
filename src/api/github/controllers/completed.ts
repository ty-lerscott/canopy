import discord from "@/tools/bots/discord";
import type { GHCompletedAction } from "@/types/github";
import dayjs from "@/utils/dayjs";

const CompletedController = async (
	// biome-ignore lint/suspicious/noExplicitAny: For any action with "created" the request body can be anything
	body: Record<string, any>,
): Promise<void> => {
	// NOTE: Github Action completed
	if (body.workflow_job) {
		const {
			sender,
			repository,
			workflow_job: {
				head_sha,
				head_branch,
				status,
				conclusion,
				started_at,
				completed_at,
			},
		} = body as GHCompletedAction;

		const wasSuccessful = status === "completed";
		const level = wasSuccessful ? "success" : "critical";
		const duration = dayjs.duration(
			dayjs(completed_at).diff(dayjs(started_at)),
		);
		const minutes = duration.minutes();
		const seconds = duration.seconds();

		await discord({
			level,
			url: repository.url,
			title: `${repository.name} pipeline ${wasSuccessful ? "completed" : "failed"}`,
			author: {
				url: sender.url,
				name: sender.login,
				avatar: sender.avatar_url,
			},
			fields: [
				{
					name: "Branch",
					value: head_branch,
					isInline: true,
				},
				{
					name: "Build Duration",
					value: `${minutes} minute${minutes === 1 ? "s" : ""} and ${seconds} second${seconds === 1 ? "s" : ""}`,
					isInline: true,
				},
			],
			footer: {
				value: head_sha,
			},
		});

		return;
	}

	console.group("UNHANDLED COMPLETE ACTION");
	// console.log(body);
	console.groupEnd();
};

export default CompletedController;
