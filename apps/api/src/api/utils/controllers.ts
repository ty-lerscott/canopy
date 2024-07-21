import { ClerkController } from "@/api/clerk";
import { DownloadController } from "@/api/download";
import { GithubController } from "@/api/github";
import { HTMLController } from "@/api/html";
import { ImageController } from "@/api/image";
import { ResumeController } from "@/api/resume";
import type { Controller as ControllerProps, Request } from "@/types";
import type { NextFunction, Response } from "express";

const Controller = async (req: Request, res: Response, next: NextFunction) => {
	const [basePath, ...extendedPath] = req.originalUrl
		.split("?")[0]
		.replace(/^\//, "")
		.split("/");

	console.log("THIS IS THE REQUEST", req.method);

	const props: ControllerProps = {
		...req,
		res,
		next,
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
			console.group("ResumeController");
			await ResumeController({ req, res, next });
			console.groupEnd();
			break;
		case "clerk":
			await ClerkController(props);
			break;
		default:
			break;
	}

	next();
};

export default Controller;
