import type { Controller } from "@/types";
import CreatedController from "./created";
import InProgressController from "./in-progress";

const GithubController = async ({ body, res }: Controller) => {
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
		default: {
			break;
		}
	}

	res.status(200);
	res.redirect("/");
};

export default GithubController;
