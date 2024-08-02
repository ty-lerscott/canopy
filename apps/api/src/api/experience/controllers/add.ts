import StatusCodes from "@/api/utils/status-codes";
import type { Controller, GetResponse } from "@/types";
import type { Experience } from "@/types/drizzle";
import db, { schema } from "@/utils/drizzle/client";
import { clerkClient } from "@clerk/clerk-sdk-node";

const addExperience = async (
	req: Controller["req"],
): Promise<GetResponse<Experience>> => {
	const resumeId = req.body.resumeId;

	if (!resumeId) {
		return Promise.resolve({
			status: StatusCodes.BAD_REQUEST,
			error: "Resume ID is required",
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

		const resp = (await db
			.insert(schema.experiences)
			.values(req.body)
			.onConflictDoUpdate({ target: schema.experiences.id, set: req.body })
			.returning()) as unknown as Experience;

		return {
			status: StatusCodes.OK,
			data: resp,
		};
	} catch (err) {
		console.log("addExperience error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export default addExperience;
