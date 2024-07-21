import type { Controller } from "@/types";

import GetController from "./controllers/get";

const ResumeController = async ({ res, next, req }: Controller) => {
	switch (req.method) {
		case "GET":
			console.group("GET CONTROLLER");
			await GetController({
				req,
				res,
			});
			console.groupEnd();
			break;
		default:
			break;
	}
	next();
};

export { ResumeController };
