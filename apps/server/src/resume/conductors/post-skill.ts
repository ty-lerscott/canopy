import type { Conductor, GetResponse } from "@/types";
import type { Skill } from "@/types/drizzle";
import StatusCodes from "@/utils/status-codes";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { dbClient, tables } from "~/apps/databases/src/resume";

const addSkill = async (req: Conductor["req"]): Promise<GetResponse<Skill>> => {
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

		const resp = (await dbClient
			.insert(tables.skills)
			.values(req.body)
			.onConflictDoUpdate({ target: tables.skills.id, set: req.body })
			.returning()) as unknown as Skill;

		return {
			status: StatusCodes.OK,
			data: resp,
		};
	} catch (err) {
		console.log("addSkill error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export default addSkill;
