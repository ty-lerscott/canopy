import type { ActiveSessionResource } from "@clerk/types";
import type { UseNavigateResult } from "@tanstack/react-router";
import type { Resume } from "~/apps/server/src/types/drizzle";

const getResume =
	({
		resumeId,
		session,
		navigate,
		onSuccess,
	}: {
		resumeId: string;
		session: ActiveSessionResource;
		navigate: UseNavigateResult<string>;
		onSuccess: (
			skills: Resume["skills"],
			experiences: Resume["experiences"],
		) => void;
	}) =>
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
		if (!isLoaded) {
			return Promise.resolve({} as Resume);
		}

		let token = "";
		if (session) {
			token = (await session.getToken()) as string;
		}

		try {
			const rawResp = await fetch(`/api/resume/${resumeId}`, {
				method: "GET",
				...(token && {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			});

			const resp = await rawResp.json();

			onSuccess(resp.data.skills, resp.data.experiences);

			return resp.data;
		} catch (err) {
			console.log("Error in getResumeQuery", (err as Error).message);
			await navigate({
				from: "/resume/$resumeId",
				to: "/",
			});
			return Promise.resolve({} as Resume);
		}
	};

export default getResume;
