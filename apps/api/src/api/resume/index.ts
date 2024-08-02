import deleteSocial from "@/api/resume/conductors/delete-social";
import { getResume, getResumes } from "@/api/resume/conductors/get-resume";
import getUser from "@/api/resume/conductors/get-user";
import addExperience from "@/api/resume/conductors/post-experience";
import addSkill from "@/api/resume/conductors/post-skill";
import updateUser from "@/api/resume/conductors/put-user";
import type { Conductor } from "@/types";

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
			if (req.method === "GET") {
				const { status, data, error } = await getResume({ req, res });

				res.status(status).json({ data, error });
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
