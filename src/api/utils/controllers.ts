import type { NextFunction, Request, Response } from "express";
import type { Logger } from "winston";

import { DownloadController } from "@/api/download";

const Controller =
	(logger: Logger) =>
	async (req: Request, res: Response, next: NextFunction) => {
		const [base, ...pathname] = req.originalUrl.replace(/^\//, "").split("/");

		switch (base) {
			case "download":
				await DownloadController({ req, res, next, logger, pathname });
				break;
			default:
				res.send("HELLO WORLD");
				break;
		}

		next();
	};

export default Controller;
