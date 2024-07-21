import type {
	Request as ExpressRequest,
	NextFunction,
	Response,
} from "express";

export type Primitives = string | number | boolean | null | Buffer | undefined;
export type PrimitiveObject = Record<string, Primitives | Primitives[]>;
export type HTTP_METHODS =
	| "GET"
	| "POST"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "HEAD"
	| "OPTIONS"
	| "TRACE"
	| "CONNECT";

export type Request = Omit<ExpressRequest, "method"> & {
	method: HTTP_METHODS;
	basePath: string;
	extendedPath: string[];
};

export type Data =
	| Primitives
	| Primitives[]
	| PrimitiveObject
	| (Primitives | PrimitiveObject)[];

export type Controller = {
	res: Response;
	body?: Record<string, Data>;
	next: NextFunction;
	method: HTTP_METHODS;
	headers: Request["headers"];
	extendedPath: string[];
	query?: PrimitiveObject | Request["query"];
};

export type GetResponse<T = Data> = {
	data?: T;
	error?: string;
	status: number;
	headers?: Record<string, string | number>;
};
