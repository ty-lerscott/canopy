import {
	CreatedController,
	InProgressController,
} from "@/api/github/controllers";
import type { Controller } from "@/types";

const GithubController = async ({ body, res }: Controller) => {
	switch (body.action) {
		case "created": {
			console.group("CreatedController");
			await CreatedController(body);
			console.groupEnd();

			break;
		}
		case "in_progress": {
			await InProgressController(body);
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
