import type { Controller } from "@/types";
import { getResume, getResumes } from "./controllers/get";

const ResumeController = async ({ res, next, req }: Controller) => {
	switch (req.method) {
		case "GET": {
			const { status, data, error } = await getResume({ req, res });

			if (status === 200) {
				res.json({ data });
			} else {
				res.status(status).send(error);
			}
			break;
		}
		default:
			break;
	}
	next();
};

const ResumesController = async ({ res, next, req }: Controller) => {
	switch (req.method) {
		case "GET": {
			const { status, data, error } = await getResumes({ req, res });

			if (status === 200) {
				res.json({ data });
			} else {
				res.status(status).send(error);
			}
			break;
		}
		default:
			break;
	}
	next();
};

export { ResumeController, ResumesController };
