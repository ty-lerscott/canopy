import { execSync } from "node:child_process";
import discord from "@/tools/bots/discord";
import type { GHCompletedAction } from "@/types/github";
import dayjs from "@/utils/dayjs";
import pkg from "~/package.json";

const IS_LOCAL = process.env.NODE_ENV === "development";

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
				status,
				head_sha,
				started_at,
				head_branch,
				completed_at,
				workflow_name,
			},
		} = body as GHCompletedAction;

		const projectName = `${repository.name}${workflow_name === pkg.name ? "" : `/${workflow_name}`}`;
		const wasSuccessful = status === "completed";
		const level = wasSuccessful ? "success" : "critical";
		const duration = dayjs.duration(
			dayjs(completed_at).diff(dayjs(started_at)),
		);
		const minutes = duration.minutes();
		const seconds = duration.seconds();
		const minutesCombined = `${minutes ? `${minutes} minute` : ""}${minutes === 1 ? "" : "s"}`;
		const secondsCombined = `${seconds ? `${seconds} second` : ""}${seconds === 1 ? "" : "s"}`;

		await discord({
			level,
			url: repository.html_url,
			title: `${projectName} pipeline ${wasSuccessful ? "completed" : "failed"}`,
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
					value: `${minutesCombined}${minutesCombined ? " and " : ""}${secondsCombined}`,
					isInline: true,
				},
			],
			footer: {
				value: head_sha,
			},
		});

		if (!IS_LOCAL) {
			execSync(`pm2 restart ${pkg.name}`);
		}
	}

	console.group("UNHANDLED COMPLETE ACTION");
	// console.log(body);
	console.groupEnd();
};

export default CompletedController;
