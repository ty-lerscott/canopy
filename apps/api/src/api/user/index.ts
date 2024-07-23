import type { Controller } from "@/types";
import { getUser } from "./controllers/get";
import { updateUser } from "./controllers/put";

const UserController = async ({ res, next, req }: Controller) => {
	console.group("UserController");
	switch (req.method) {
		case "POST": {
			const { status, data, error } = await getUser(req);

			if (status === 200) {
				res.json(data);
			} else {
				res.status(status).json({ error });
			}
			break;
		}
		case "PUT": {
			const { status, data, error } = await updateUser(req);

			if (status === 200) {
				res.json(data);
			} else {
				res.status(status).json({ error });
			}
			break;
		}
		default:
			break;
	}
	console.groupEnd();
	next();
};

export { UserController };
