import db, { schema } from "@/api/drizzle/client";
import StatusCodes from "@/api/utils/status-codes";
import DEFAULT_USER from "@/defaults/user";
import type { Controller, GetResponse } from "@/types";
import type { User } from "@/types/drizzle";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { sql } from "drizzle-orm";
import merge from "lodash.mergewith";

const updateUser = async (
	req: Controller["req"],
): Promise<GetResponse<User>> => {
	const { socials, ...user } = req.body;

	if (!user.id) {
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

		if (isSignedIn) {
			const { userId: clerkUserId } = toAuth();

			if (clerkUserId !== user.id) {
				return Promise.resolve({
					status: StatusCodes.BAD_REQUEST,
					error: "User ID mismatch",
				});
			}
		}

		if (Array.isArray(socials) && socials.length) {
			for (const social of socials) {
				await db.insert(schema.socials).values(social).onConflictDoUpdate({
					target: schema.socials.id,
					set: social,
				});
			}
		}

		let result = (await db
			.insert(schema.users)
			.values(user)
			.onConflictDoUpdate({ target: schema.users.id, set: user })
			.returning()) as unknown as User;

		result.isEditable = true;

		if (result) {
			const { firstName, lastName, emailAddresses } =
				await clerkClient.users.getUser(user.id);

			result = merge(
				{},
				result,
				{ firstName, lastName, emailAddress: emailAddresses[0].emailAddress },
				(oldVal, newVal) => oldVal ?? newVal,
			);
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
		console.log("updateUser error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export { updateUser };
