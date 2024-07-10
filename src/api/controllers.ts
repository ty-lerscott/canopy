import { omit } from "@/api/utils";
import type { NextFunction, Request, Response } from "express";

import { DownloadController } from "@/api/download";
import { HTMLController } from "@/api/html";
import { ImageController } from "@/api/image";

const Controller = async (req: Request, res: Response, next: NextFunction) => {
	const body = req.body;
	const query = omit<Request["query"]>(req.query, [
		"auto",
		"w",
		"fit",
		"ixlib",
		"ixid",
	]);
	const [base, ...pathname] = req.originalUrl
		.split("?")[0]
		.replace(/^\//, "")
		.split("/");

	const props = { body, query, res, next, pathname };

	switch (base) {
		case "download":
			await DownloadController(props);
			break;
		case "image":
			await ImageController(props);
			break;
		case "html":
			await HTMLController(props);
			break;
		default:
			break;
	}

	next();
};

export default Controller;
