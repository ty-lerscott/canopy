import type { Request } from "@/types";
import express, { type NextFunction, type Response } from "express";

const ImagesMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const isImageResource = req.url.match(/\/(images)\//);

	if (isImageResource) {
		req.url = req.url.substring(
			isImageResource.index as number,
			req.url.length,
		);

		express.static("public")(req, res, next);
	} else {
		next();
	}
};

export default ImagesMiddleware;
