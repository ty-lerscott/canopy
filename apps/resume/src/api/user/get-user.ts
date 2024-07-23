import type { ActiveSessionResource } from "@clerk/types";
import merge from "deepmerge";
import type { User } from "~/apps/api/src/types/drizzle";

type Options = {
	socials?: boolean;
	education?: boolean;
	callback?: (socials: User["socials"]) => void;
};

const getUser =
	({
		userId,
		session,
		options,
	}: { userId: string; session: ActiveSessionResource; options?: Options }) =>
	async ({
		queryKey,
	}: {
		queryKey: [
			string,
			{
				isLoaded: boolean;
			},
		];
	}): Promise<User> => {
		const { isLoaded } = queryKey[1];

		if (!session || !isLoaded) {
			return Promise.resolve({} as User);
		}

		const token = await session.getToken();

		try {
			const rawResp = await fetch("/api/user", {
				method: "POST",
				headers: merge(
					{
						"Content-Type": "application/json",
					},
					{
						...(token && {
							Authorization: `Bearer ${token}`,
						}),
					},
				),
				body: JSON.stringify({
					userId,
					socials: options?.socials ?? true,
					education: options?.education ?? true,
				}),
			});

			const resp: User = await rawResp.json();

			options?.callback?.(resp.socials);

			return resp;
		} catch (err) {
			console.log("Error in getUserQuery", (err as Error).message);
			return Promise.resolve({} as User);
		}
	};

export default getUser;
