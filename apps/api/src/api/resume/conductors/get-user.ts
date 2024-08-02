import StatusCodes from "@/api/utils/status-codes";
import DEFAULT_USER from "@/defaults/user";
import type { Conductor, GetResponse } from "@/types";
import type { User } from "@/types/drizzle";
import db from "@/utils/drizzle/client";
import { clerkClient } from "@clerk/clerk-sdk-node";
import merge from "lodash.mergewith";

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

		const result = (await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, userId as string),
			with: {
				socials,
				education,
			},
		})) as unknown as User;

		result.isEditable = false;

		if (isSignedIn && result) {
			const { userId: clerkUserId } = toAuth();

			result.isEditable = clerkUserId === result.id;
		}

		if (result) {
			const { firstName, lastName, emailAddresses } =
				await clerkClient.users.getUser(userId);

			result.firstName = result.firstName ?? firstName;
			result.lastName = result.lastName ?? lastName;
			result.emailAddress =
				result.emailAddress ?? emailAddresses[0].emailAddress;
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
