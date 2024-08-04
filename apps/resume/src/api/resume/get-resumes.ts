import type { ActiveSessionResource } from "@clerk/types";
import type { Resume } from "~/apps/api/src/types/drizzle";

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

		console.log("GETRESUMES", { isLoaded });

		if (!session || !isLoaded) {
			return Promise.resolve([] as Resume[]);
		}

		const token = await session.getToken();

		if (!token) {
			return Promise.resolve([] as Resume[]);
		}

		try {
			const rawResp = await fetch("/api/resumes", {
				method: "GET",
				headers: {
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
