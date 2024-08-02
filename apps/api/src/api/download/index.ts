import type { Conductor } from "@/types";
import getResume from "./conductors/get-resume";

const DownloadConductor = async ({
	res,
	next,
	req: {
		extendedPath: [subject],
	},
}: Conductor) => {
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

export default DownloadConductor;
