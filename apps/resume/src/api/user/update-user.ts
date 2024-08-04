import type { ActiveSessionResource } from "@clerk/types";
import type { User } from "~/apps/server/src/types/drizzle";

const updateUser =
	(session: ActiveSessionResource) =>
	async ({
		mutationKey,
	}: {
		mutationKey: [string, user: User];
	}): Promise<User> => {
		const user = mutationKey[1];

		if (!session) {
			return Promise.resolve({} as User);
		}

		user.socials = user.socials.map((social) => ({
			...social,
			userId: user.id,
		}));

		user.education = user.education.map((education) => ({
			...education,
			userId: user.id,
		}));

		const token = await session.getToken();

		if (!token) {
			return Promise.resolve({} as User);
		}

		try {
			const rawResp = await fetch("/api/resume/user", {
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
