import type { Controller } from "@/types";

import GetController from "./controllers/get";

const ResumeController = async ({
	body,
	res,
	query,
	method,
	next,
	extendedPath,
}: Controller) => {
	switch (method) {
		case "GET":
			await GetController({ body, res, query, method, next, extendedPath });
			break;
		default:
			break;
	}
};

export { ResumeController };
