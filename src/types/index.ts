import type { NextFunction, Request, Response } from "express";
import type { Logger } from "winston";

type Primitives = string | number | boolean | null | Buffer;
type PrimitiveObject = Record<string, Primitives | Primitives[]>;

export type Controller = {
	req: Request;
	res: Response;
	logger: Logger;
	next: NextFunction;
	pathname: string[];
};

export type RequestConfig = {
	res: Response;
	logger: Logger;
};

export type Data =
	| Primitives
	| Primitives[]
	| PrimitiveObject
	| (Primitives | PrimitiveObject)[];

export type GetResponse = {
	data?: Data;
	error?: string;
	status: number;
	headers?: Record<string, string>;
};
