import type { ActiveSessionResource } from "@clerk/types";
import type { Resume } from "~/apps/server/src/types/drizzle";

const API_URL = import.meta.env.VITE_API_URL;

const addResume =
	(session: ActiveSessionResource | null | undefined) =>
	async (): Promise<Resume | undefined> => {
		let token = "";
		if (session) {
			token = (await session.getToken()) as string;
		}

		try {
			const rawResp = await fetch(`${API_URL}/resume`, {
				method: "POST",
				...(token && {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			});

			const resp = await rawResp.json();

			return resp.data;
		} catch (err) {
			console.log("addResume error", (err as Error).message);

			return;
		}
	};

export default addResume;
