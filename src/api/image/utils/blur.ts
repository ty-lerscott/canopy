import { logger } from "@/api/logger";
import codes from "@/api/utils/status-codes";
import type { GetResponse } from "@/types";
import getImage from "./get-image";

const blur = async (url: string) => {
	const responseBody: GetResponse<Buffer> = { status: codes.OK };

	if (!url) {
		console.log("Missing URL");
		responseBody.status = codes.BAD_REQUEST;
		responseBody.error = "Bad Request: url parameter is required";

		return Promise.resolve(responseBody);
	}

	try {
		const { data } = await getImage(url);

		responseBody.data = data;
		responseBody.headers = {
			"Content-Type": "image/png",
			"Content-Length": data?.length.toString() || "",
		};
		responseBody.status = codes.OK;
	} catch (error) {
		logger.error("Error blurring image:", error);

		responseBody.status = codes.SERVER_ERROR;
		responseBody.error = (error as Error).message;
	}

	return responseBody;
};

export default blur;
