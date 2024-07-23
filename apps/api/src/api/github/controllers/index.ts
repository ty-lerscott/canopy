import StatusCodes from "@/api/utils/status-codes";
import type { Controller } from "@/types";
import CompletedController from "./completed";
import CreatedController from "./created";
import InProgressController from "./in-progress";

const GithubController = async ({ req: { body }, res, method }: Controller) => {
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
			console.group("CreatedController");
			await CreatedController(body);
			console.groupEnd();
			break;
		}
		case "in_progress": {
			console.group("InProgressController");
			await InProgressController(body);
			console.groupEnd();
			break;
		}
		case "completed": {
			console.group("CompletedController");
			await CompletedController(body);
			console.groupEnd();
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
