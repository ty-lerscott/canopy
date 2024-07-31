import type { Controller } from "@/types";
import addSkill from "./controllers/add";

const SkillController = async ({ res, next, req }: Controller) => {
	console.group("SkillController");
	switch (req.method) {
		case "POST": {
			const { status, data, error } = await addSkill(req);

			res.status(status).json({ data, error });
			break;
		}
		default:
			break;
	}
	console.groupEnd();
	next();
};

export { SkillController };
