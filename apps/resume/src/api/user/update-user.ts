import type { ActiveSessionResource } from "@clerk/types";
import type { User } from "~/apps/api/src/types/drizzle";

const updateUser =
	(session: ActiveSessionResource) =>
	async ({
		mutationKey,
	}: {
		mutationKey: [
			string,
			{
				user: User;
				isLoaded: boolean;
			},
		];
	}): Promise<User> => {
		const { isLoaded, user } = mutationKey[1];

		if (!session || !isLoaded) {
			return Promise.resolve({} as User);
		}

		const token = await session.getToken();

		if (!token) {
			return Promise.resolve({} as User);
		}

		try {
			const rawResp = await fetch("/api/user", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(user),
			});

			const resp = await rawResp.json();

			return resp.data;
		} catch (err) {
			console.log("updateUser error:", (err as Error).message);
			return Promise.resolve({} as User);
		}
	};

export default updateUser;
