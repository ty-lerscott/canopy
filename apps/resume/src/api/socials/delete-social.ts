import type { ActiveSessionResource } from "@clerk/types";
import type { Social } from "~/apps/api/src/types/drizzle";

const deleteSocial =
	(session: ActiveSessionResource) =>
	async ({
		mutationKey,
	}: {
		mutationKey: [string, id: Social["id"]];
	}): Promise<undefined | { error: string }> => {
		const id = mutationKey[1];

		if (!session) {
			return Promise.reject({} as Social);
		}

		const token = await session.getToken();

		if (!token) {
			return Promise.reject({} as Social);
		}

		try {
			const rawResp = await fetch("/api/socials", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ id }),
			});

			const resp = await rawResp.json();

			if (resp.error) {
				return Promise.reject(new Error(resp.error));
			}

			return;
		} catch (err) {
			console.log("deleteSocial error:", (err as Error).message);
			return Promise.reject({ error: (err as Error).message });
		}
	};

export default deleteSocial;