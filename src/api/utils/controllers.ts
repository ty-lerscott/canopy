import { DownloadController } from "@/api/download";
import { GithubController } from "@/api/github";
import { HTMLController } from "@/api/html";
import { ImageController } from "@/api/image";
import type { NextFunction, Request, Response } from "express";

const Controller = async (
	{ body, query, originalUrl }: Request,
	res: Response,
	next: NextFunction,
) => {
	const [base, ...pathname] = originalUrl
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
		case "github":
			await GithubController(props);
			break;
		default:
			break;
	}

	next();
};

export default Controller;
