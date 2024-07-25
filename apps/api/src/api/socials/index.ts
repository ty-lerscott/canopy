import type { Controller } from "@/types";
import deleteSocial from "./controllers/delete";

const SocialsController = async ({ res, next, req }: Controller) => {
	console.group("SocialsController");
	switch (req.method) {
		case "DELETE": {
			const { status, data, error } = await deleteSocial(req);

			res.status(status).json({ data, error });
			break;
		}
		default:
			break;
	}
	console.groupEnd();
	next();
};

export { SocialsController };
