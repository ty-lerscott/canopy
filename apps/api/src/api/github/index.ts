import StatusCodes from "@/api/utils/status-codes";
import type { Conductor } from "@/types";
import CompletedController from "./conductors/completed";
import CreatedController from "./conductors/created";
import InProgressController from "./conductors/in-progress";

const GithubController = async ({ req: { body, method }, res }: Conductor) => {
	if (method !== "POST") {
		res.status(StatusCodes.METHOD_NOT_ALLOWED);
		res.end();
		return;
	}

	if (!body?.action) {
		res.status(StatusCodes.CONTINUE);
		res.end();
		return;
	}

	switch (body.action) {
		case "created": {
			await CreatedController(body);
			break;
		}
		case "in_progress": {
			await InProgressController(body);
			break;
		}
		case "completed": {
			await CompletedController(body);
			break;
		}
		case "workflow_run": {
			break;
		}
		case "queued": {
			break;
		}
		default: {
			console.log("UNHANDLED GITHUB ACTION:", body.action);
			break;
		}
	}

	res.status(200).end();
};

export default GithubController;
