import DEFAULT_USER from "@/defaults/user";
import type { Conductor, GetResponse } from "@/types";
import type { User } from "@/types/drizzle";
import StatusCodes from "@/utils/status-codes";
import { clerkClient } from "@clerk/clerk-sdk-node";
import merge from "lodash.mergewith";
import { dbClient, tables } from "~/apps/databases/src/resume";

const getUser = async (req: Conductor["req"]): Promise<GetResponse<User>> => {
	const { userId, socials, education } = req.body;

	if (!userId) {
		return Promise.resolve({
			status: StatusCodes.BAD_REQUEST,
			error: "User ID is required",
		});
	}

	try {
		const { isSignedIn, toAuth } = await clerkClient.authenticateRequest({
			url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
			// @ts-ignore
			headers: req.headers,
		});

		const isAuthor = toAuth()?.userId === userId;

		let result = (await dbClient.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, userId),
			with: {
				socials,
				education,
			},
		})) as unknown as User;

		if (!result && isAuthor) {
			const { firstName, lastName, emailAddresses } =
				await clerkClient.users.getUser(userId);

			result = (await dbClient
				.insert(tables.users)
				.values({
					id: userId,
					firstName,
					lastName,
					emailAddress: emailAddresses[0].emailAddress,
				})
				.returning()) as unknown as User;
		}

		return {
			status: StatusCodes.OK,
			data: merge(
				{},
				DEFAULT_USER,
				result,
				(oldVal, newVal) => newVal ?? oldVal,
			),
		};
	} catch (err) {
		console.log("getting conductors error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export default getUser;
