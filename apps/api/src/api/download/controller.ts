import type { Controller } from "@/types";

import getResume from "./resume/get";

const DownloadController = async ({
	res,
	next,
	req: {
		extendedPath: [subject],
	},
}: Controller) => {
	switch (subject) {
		case "resume": {
			const { data, error, status, headers } = await getResume();
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

export default DownloadController;
