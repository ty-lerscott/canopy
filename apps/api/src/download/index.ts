import type { Conductor } from "@/types";
import StatusCodes from "@/utils/status-codes";
import getResume from "./conductors/get-resume";

const DownloadConductor = async ({
	res,
	next,
	req: {
		method,
		extendedPath: [subject, resumeId],
	},
}: Conductor) => {
	if (method !== "GET") {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: "Unauthorized request",
		});
	}

	switch (subject) {
		case "resume": {
			const { data, error, status, headers } = await getResume(resumeId);
			res.set(headers);
			res.status(status).send(data || error);
			break;
		}
		default: {
			res.send(`Download: ${subject}`);
			break;
		}
	}
	next();
};

export default DownloadConductor;
