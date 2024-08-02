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
	host: string;
	headers: ExpressRequest["headers"];
	extendedPath: string[];
};

export type Data =
	| Primitives
	| Primitives[]
	| PrimitiveObject
	| (Primitives | PrimitiveObject)[];

export type Conductor = {
	res: Response;
	req: Request;
	next: NextFunction;
};

export type GetResponse<T = Data> = {
	data?: T;
	error?: string;
	status: number;
	headers?: Record<string, string | number>;
};
