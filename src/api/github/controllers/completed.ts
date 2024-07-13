import { execSync } from "node:child_process";
import { logger } from "@/api/utils/logger";
import discord from "@/tools/bots/discord";
import type { GHCompletedAction } from "@/types/github";
import dayjs from "@/utils/dayjs";
import pkg from "~/package.json";

const IS_LOCAL = process.env.NODE_ENV === "development";

const CompletedController = async (body: GHCompletedAction): Promise<void> => {
	// NOTE: Github Action completed
	if (body.workflow_job) {
		const {
			sender,
			repository,
			workflow_job: { status, head_sha, started_at, head_branch, completed_at },
		} = body as GHCompletedAction;

		const wasSuccessful = status === "completed";
		const level = wasSuccessful ? "success" : "critical";
		const duration = dayjs.duration(
			dayjs(completed_at).diff(dayjs(started_at)),
		);
		const minutes = duration.minutes();
		const seconds = duration.seconds();
		const minutesCombined = `${minutes ? `${minutes} minute` : ""}${minutes === 1 ? "" : "s"}`;
		const secondsCombined = `${seconds ? `${seconds} second` : ""}${seconds === 1 ? "" : "s"}`;

		try {
			await discord({
				level,
				url: repository.html_url,
				title: `${repository.name} pipeline ${wasSuccessful ? "completed" : "failed"}`,
				author: {
					name: sender.login,
					url: sender.html_url,
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
		} catch (err) {
			logger.error((err as Error).message);
		}

		if (!IS_LOCAL) {
			execSync(`pm2 restart ${pkg.name}`);
		}
	}

	console.group("UNHANDLED COMPLETE ACTION");
	// console.log(body);
	console.groupEnd();
};

export default CompletedController;
