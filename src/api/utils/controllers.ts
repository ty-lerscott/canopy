import type { Logger } from "winston";
import type { Request, Response, NextFunction } from "express";

import { DownloadController } from "@/api/download";

const Controller =
	(logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
		const [base, ...pathname] = req.originalUrl.replace(/^\//, "").split("/");

		switch (base) {
			case "download":
				DownloadController({ req, res, next, logger, pathname });
				break;
			default:
				res.send("HELLO WORLD");
				break;
		}

		next();
	};

export default Controller;
