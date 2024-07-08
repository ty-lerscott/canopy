import type { Logger } from "winston";
import type { Request, Response, NextFunction } from "express";

export type Controller = {
	req: Request;
	res: Response;
	logger: Logger;
	next: NextFunction;
	pathname: string[];
};
