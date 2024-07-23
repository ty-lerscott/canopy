import type { ActiveSessionResource } from "@clerk/types";
import type { Resume } from "~/apps/api/src/types/drizzle";

const getResume =
	(resumeId: string, session: ActiveSessionResource) =>
	async ({
		queryKey,
	}: {
		queryKey: [
			string,
			{
				isLoaded: boolean;
			},
		];
	}): Promise<Resume> => {
		const { isLoaded } = queryKey[1];

		if (!session || !isLoaded) {
			return Promise.resolve({} as Resume);
		}

		const token = await session.getToken();

		try {
			const rawResp = await fetch(`/api/resume?resume=${resumeId}`, {
				method: "GET",
				...(token && {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			});

			const resp = await rawResp.json();

			return resp.data;
		} catch (err) {
			console.log("Error in getResumeQuery", (err as Error).message);
			return Promise.resolve({} as Resume);
		}
	};

export default getResume;
