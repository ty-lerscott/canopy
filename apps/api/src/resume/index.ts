import type { Conductor } from "@/types";
import deleteSocial from "./conductors/delete-social";
import { getResume, getResumes } from "./conductors/get-resume";
import addResume from "./conductors/post-resume";
import getUser from "./conductors/get-user";
import addExperience from "./conductors/post-experience";
import addSkill from "./conductors/post-skill";
import updateUser from "./conductors/put-user";

const ResumeConductor = async ({ res, next, req }: Conductor) => {
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
			switch (req.method) {
				case "POST": {
					const { status, data, error } = await addResume(req);

					res.status(status).json({ data, error });
					break;
				}
				default: {
					const { status, data, error } = await getResume({ req, res });

					res.status(status).json({ data, error });
					break;
				}
			}
			break;
	}
	next();
};

const ResumesConductor = async ({ res, next, req }: Conductor) => {
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

export { ResumeConductor, ResumesConductor };
