import { logger } from "@/api/utils/logger";
import discord from "@/tools/bots/discord";
import type { GHInProgressAction, GHWorkflowJob } from "@/types/github";

const InProgressController = async ({
	sender,
	repository,
	...body
}: GHInProgressAction): Promise<void> => {
	if (body.workflow_job) {
		const { head_branch, run_url, status, head_sha } =
			body.workflow_job as GHWorkflowJob;

		switch (status) {
			case "in_progress": {
				try {
					await discord({
						url: run_url,
						level: "notice",
						title: `${repository.name} build started`,
						author: {
							name: sender.login,
							url: sender.html_url,
							avatar: sender.avatar_url,
						},
						fields: [
							{
								name: "Branch",
								value: head_branch,
							},
						],
						footer: {
							value: head_sha,
						},
					});
				} catch (err) {
					logger.error(
						`is this the same error as discord? ${(err as Error).message}`,
					);
				}
				break;
			}
			default: {
				break;
			}
		}
	}

	return new Promise<void>((resolve) => {
		resolve();
	});
};

export default InProgressController;
