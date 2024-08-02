import type { Controller } from "@/types";
import deleteSocial from "./controllers/delete-social";
import { getResume, getResumes } from "./controllers/get-resume";
import getUser from "./controllers/get-user";
import addExperience from "./controllers/post-experience";
import addSkill from "./controllers/post-skill";
import updateUser from "./controllers/put-user";

const ResumeController = async ({ res, next, req }: Controller) => {
	const [route] = req.extendedPath;
	const { method } = req;

	switch (route) {
		case "experience":
			if (["PUT", "POST"].includes(method)) {
				const { status, data, error } = await addExperience(req);

				res.status(status).json({ data, error });
			}
			break;
		case "skill":
			if (method === "POST") {
				const { status, data, error } = await addSkill(req);

				res.status(status).json({ data, error });
			}
			break;
		case "social":
			if (method === "DELETE") {
				const { status, data, error } = await deleteSocial(req);

				res.status(status).json({ data, error });
			}
			break;
		case "user": {
			const action = method === "POST" ? getUser : updateUser;
			const { status, data, error } = await action(req);

			res.status(status).json({ data, error });

			break;
		}
		default:
			if (req.method === "GET") {
				const { status, data, error } = await getResume({ req, res });

				res.status(status).json({ data, error });
			}
			break;
	}
	next();
};

const ResumesController = async ({ res, next, req }: Controller) => {
	switch (req.method) {
		case "GET": {
			const { status, data, error } = await getResumes({ req, res });

			res.status(status).json({ data, error });
			break;
		}
		default:
			break;
	}
	next();
};

export { ResumeController, ResumesController };
