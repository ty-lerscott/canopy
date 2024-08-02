import type { Controller } from "@/types";
import addExperience from "./controllers/add";

const ExperienceController = async ({ res, next, req }: Controller) => {
	console.group("ExperienceController");
	switch (req.method) {
		case "POST":
		case "PUT": {
			const { status, data, error } = await addExperience(req);

			res.status(status).json({ data, error });
			break;
		}
		default:
			break;
	}
	console.groupEnd();
	next();
};

export { ExperienceController };
