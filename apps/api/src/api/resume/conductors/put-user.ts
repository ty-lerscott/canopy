import StatusCodes from "@/api/utils/status-codes";
import DEFAULT_USER from "@/defaults/user";
import type { Conductor, GetResponse } from "@/types";
import type { User } from "@/types/drizzle";
import { clerkClient } from "@clerk/clerk-sdk-node";
import merge from "lodash.mergewith";
import { dbClient, schemas } from "~/apps/database/src";

const updateUser = async (
	req: Conductor["req"],
): Promise<GetResponse<User>> => {
	const { socials, education, ...user } = req.body;

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
		} else {
			return Promise.resolve({
				status: StatusCodes.UNAUTHORIZED,
				error: "Unauthorized user",
			});
		}

		if (Array.isArray(socials) && socials.length) {
			for (const social of socials) {
				await dbClient
					.insert(schemas.socials)
					.values(social)
					.onConflictDoUpdate({
						target: schemas.socials.id,
						set: social,
					});
			}
		}

		if (Array.isArray(education) && education.length) {
			for (const ed of education) {
				await dbClient.insert(schemas.education).values(ed).onConflictDoUpdate({
					target: schemas.education.id,
					set: ed,
				});
			}
		}

		if (Object.values(user).some((val) => Boolean(val))) {
			const result = (await dbClient
				.insert(schemas.users)
				.values(user)
				.onConflictDoUpdate({ target: schemas.users.id, set: user })
				.returning()) as unknown as User;

			const { firstName, lastName, emailAddresses } =
				await clerkClient.users.getUser(user.id);

			return {
				status: StatusCodes.OK,
				data: merge(
					{},
					merge({}, DEFAULT_USER, result, (oldVal, newVal) => oldVal ?? newVal),
					{
						firstName,
						lastName,
						emailAddress: emailAddresses[0].emailAddress,
						isEditable: true,
					},
				),
			};
		}

		return {
			status: StatusCodes.BAD_REQUEST,
			error: `User data incomplete, please add keys for ${Object.entries(user)
				.reduce((acc, [key, value]) => {
					const newAcc = acc;

					if (!value) {
						newAcc.push(key);
					}
					return newAcc;
				}, [] as string[])
				.join(", ")}`,
		};
	} catch (err) {
		console.log("updateUser error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export default updateUser;
