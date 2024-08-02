import StatusCodes from "@/api/utils/status-codes";
import type { Conductor, GetResponse } from "@/types";
import type { Social } from "@/types/drizzle";
import db, { schema } from "@/utils/drizzle/client";
import { socials } from "@/utils/drizzle/schemas";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { and, eq } from "drizzle-orm/sql";

const deleteSocial = async (
	req: Conductor["req"],
): Promise<GetResponse<Social>> => {
	const { id } = req.body;

	if (!id) {
		return Promise.resolve({
			status: StatusCodes.BAD_REQUEST,
			error: "Social ID is required",
		});
	}

	try {
		const { isSignedIn, toAuth } = await clerkClient.authenticateRequest({
			url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
			// @ts-ignore
			headers: req.headers,
		});

		if (!isSignedIn) {
			return Promise.resolve({
				status: StatusCodes.UNAUTHORIZED,
				error: "Unauthorized user",
			});
		}

		await db
			.delete(schema.socials)
			.where(and(eq(socials.id, id), eq(socials.userId, toAuth().userId)));

		return {
			status: StatusCodes.OK,
		};
	} catch (err) {
		console.log("deleteSocial error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export default deleteSocial;
