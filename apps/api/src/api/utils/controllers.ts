import { DownloadController } from "@/api/download";
import { GithubController } from "@/api/github";
import { HTMLController } from "@/api/html";
import { ImageController } from "@/api/image";
import { ResumeController } from "@/api/resume";
import type { Controller as ControllerProps, Request } from "@/types";
import type { NextFunction, Response } from "express";

const Controller = async (
	{ body, query, method, basePath, extendedPath }: Request,
	res: Response,
	next: NextFunction,
) => {
	const props: ControllerProps = {
		body,
		query,
		res,
		next,
		method,
		extendedPath,
	};

	switch (basePath) {
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
		case "resume":
			await ResumeController(props);
			break;
		default:
			break;
	}

	next();
};

export default Controller;
