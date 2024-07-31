import type { ActiveSessionResource } from "@clerk/types";
import type { Skill } from "~/apps/api/src/types/drizzle";

const addSkill =
	(session: ActiveSessionResource | null | undefined) =>
	async ({
		mutationKey,
	}: {
		mutationKey: [string, skill: Skill];
	}): Promise<undefined | { error: string }> => {
		const skill = mutationKey[1];

		if (!session || !skill.resumeId) {
			return Promise.reject({} as Skill);
		}

		const token = await session.getToken();

		if (!token) {
			return Promise.reject({} as Skill);
		}

		try {
			const rawResp = await fetch("/api/skill", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(skill),
			});

			const resp = await rawResp.json();

			if (resp.error) {
				return Promise.reject(new Error(resp.error));
			}

			return;
		} catch (err) {
			console.log("addSkill error:", (err as Error).message);
			return Promise.reject({ error: (err as Error).message });
		}
	};

export default addSkill;
