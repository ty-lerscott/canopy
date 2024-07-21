import StatusCodes from "@/api/utils/status-codes";
import type { Controller } from "@/types";

const ClerkController = async ({ body, res, method }: Controller) => {
	if (method !== "POST") {
		res.status(StatusCodes.METHOD_NOT_ALLOWED);
		res.end();
		return;
	}

	console.group("ClerkController");
	//
	// if (!body?.action) {
	//     res.status(StatusCodes.CONTINUE);
	//     res.end();
	//     return;
	// }
	console.log(body);

	console.groupEnd();
	res.status(200).end();
};

export default ClerkController;
