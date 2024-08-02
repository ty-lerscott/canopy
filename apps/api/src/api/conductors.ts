import DownloadConductor from "@/api/download";
import GithubConductor from "@/api/github";
import ImageConductor from "@/api/image";
import { ResumeConductor, ResumesConductor } from "@/api/resume";
import type { Conductor, Request } from "@/types";
import type { NextFunction, Response } from "express";

const Conductors = async (req: Request, res: Response, next: NextFunction) => {
	const [basePath, ...extendedPath] = req.originalUrl
		.split("?")[0]
		.replace(/^\//, "")
		.split("/");

	const newReq = req;
	newReq.extendedPath = extendedPath;

	const props: Conductor = {
		res,
		next,
		req: newReq,
	};

	switch (basePath) {
		case "download":
			await DownloadConductor(props);
			break;
		case "image":
			await ImageConductor(props);
			break;
		case "github":
			await GithubConductor(props);
			break;
		case "resume":
			await ResumeConductor(props);
			break;
		case "resumes":
			await ResumesConductor(props);
			break;
		default:
			break;
	}

	next();
};

export default Conductors;
