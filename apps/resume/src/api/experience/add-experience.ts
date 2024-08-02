import type { ActiveSessionResource } from "@clerk/types";
import type { Experience } from "~/apps/api/src/types/drizzle";

const addExperience =
	(session: ActiveSessionResource | null | undefined) =>
	async ({
		mutationKey,
	}: {
		mutationKey: [string, experience: Experience];
	}): Promise<undefined | { error: string }> => {
		const experience = mutationKey[1];

		if (!session || !experience.resumeId) {
			return Promise.reject({} as Experience);
		}

		const token = await session.getToken();

		if (!token) {
			return Promise.reject({} as Experience);
		}

		try {
			experience.body = btoa(experience.body);

			const rawResp = await fetch("/api/experience", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(experience),
			});

			const resp = await rawResp.json();

			if (resp.error) {
				return Promise.reject(new Error(resp.error));
			}

			return;
		} catch (err) {
			console.log("addExperience error:", (err as Error).message);
			return Promise.reject({ error: (err as Error).message });
		}
	};

export default addExperience;
