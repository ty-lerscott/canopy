import type { Conductor, GetResponse } from "@/types";
import type { Resume } from "@/types/drizzle";
import StatusCodes from "@/utils/status-codes";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { faker } from "@faker-js/faker";
import { dbClient, tables } from "~/apps/databases/src/resume";

const postResume = async (
	req: Conductor["req"],
): Promise<GetResponse<Resume>> => {
	const resume = Object.keys(req.body).some((key) => Boolean(key))
		? req.body
		: null;

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

		const insert = resume ?? {
			userId: toAuth().userId,
			name: faker.word.words(2),
		};

		const resp = (await dbClient
			.insert(tables.resumes)
			.values(insert)
			.onConflictDoUpdate({ target: tables.resumes.id, set: insert })
			.returning()) as unknown as Resume[];

		return {
			status: StatusCodes.OK,
			data: resp[0],
		};
	} catch (err) {
		console.log("addResume error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export default postResume;
