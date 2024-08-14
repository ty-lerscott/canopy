import type { ActiveSessionResource } from "@clerk/types";
import type { Resume } from "~/apps/server/src/types/drizzle";

const API_URL = import.meta.env.VITE_API_URL;

const getResumes =
	(session: ActiveSessionResource) =>
	async ({
		queryKey,
	}: {
		queryKey: [
			string,
			{
				isLoaded: boolean;
			},
		];
	}): Promise<Resume[]> => {
		const { isLoaded } = queryKey[1];

		if (!session || !isLoaded) {
			return Promise.resolve([] as Resume[]);
		}

		const token = await session.getToken();

		if (!token) {
			return Promise.resolve([] as Resume[]);
		}

		try {
			const rawResp = await fetch(`${API_URL}/resumes`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const resp = await rawResp.json();

			return resp.data;
		} catch (err) {
			console.log("getResumes error:", (err as Error).message);
			return Promise.resolve([] as Resume[]);
		}
	};

export default getResumes;
