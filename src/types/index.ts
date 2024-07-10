import type { NextFunction, Request, Response } from "express";

export type Primitives = string | number | boolean | null | Buffer | undefined;
export type PrimitiveObject = Record<string, Primitives | Primitives[]>;

export type NormalizeHeader = {
	setHeaders: Response["set"];
	setStatus: Response["status"];
};

export type Controller = {
	res: Response;
	next: NextFunction;
	pathname: string[];
	body: Record<string, string | number>;
	query: PrimitiveObject | Request["query"];
};

export type Data =
	| Primitives
	| Primitives[]
	| PrimitiveObject
	| (Primitives | PrimitiveObject)[];

export type GetResponse<T = Data> = {
	data?: T;
	error?: string;
	status: number;
	headers?: Record<string, string | number>;
};
