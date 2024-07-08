import type { Controller } from "@/types";

import getResume from "./resume";

const DownloadController = async ({
	res,
	next,
	pathname,
	logger,
}: Controller) => {
	const [subject] = pathname;
	switch (subject) {
		case "resume": {
			const resp = await getResume({ res, logger });
			res.send(resp);
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
