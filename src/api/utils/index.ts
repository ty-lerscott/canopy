import type { Controller, GetResponse } from "@/types";

export const normalize =
	(res: Controller["res"]) =>
	({
		headers,
		data,
		status,
		error,
	}: GetResponse): GetResponse["data"] | GetResponse["error"] => {
		res.set(headers);
		res.status(status);

		return data || error;
	};
