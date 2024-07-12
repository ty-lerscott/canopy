import { omit } from "@/api/utils";
import type { Request } from "@/types";
import type { NextFunction, Response } from "express";

const RequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
	req.method = req.method.toUpperCase() as Request["method"];
	req.query = omit(req.query, ["auto", "w", "fit", "ixlib", "ixid"]);

	const [base, ...pathname] = req.originalUrl
		.split("?")[0]
		.replace(/^\//, "")
		.split("/");

	req.basePath = base;
	req.extendedPath = pathname;

	next();
};

export default RequestMiddleware;
