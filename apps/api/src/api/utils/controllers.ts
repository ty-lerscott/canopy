import { DownloadController } from "@/api/download";
import { GithubController } from "@/api/github";
import { HTMLController } from "@/api/html";
import { ImageController } from "@/api/image";
import { ResumeController, ResumesController } from "@/api/resume";
import { UserController } from "@/api/user";
import type { Controller as ControllerProps, Request } from "@/types";
import type { NextFunction, Response } from "express";

const Controller = async (req: Request, res: Response, next: NextFunction) => {
	const [basePath, ...extendedPath] = req.originalUrl
		.split("?")[0]
		.replace(/^\//, "")
		.split("/");

	const newReq = req;
	newReq.extendedPath = extendedPath;

	const props: ControllerProps = {
		res,
		next,
		req: newReq,
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
		case "resumes":
			await ResumesController(props);
			break;
		case "user":
			await UserController(props);
			break;
		default:
			break;
	}

	next();
};

export default Controller;
