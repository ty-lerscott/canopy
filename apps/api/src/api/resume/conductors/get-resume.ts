import StatusCodes from "@/api/utils/status-codes";
import DEFAULT_RESUME from "@/defaults/resume";
import type { Controller, GetResponse } from "@/types";
import type { Resume } from "@/types/drizzle";
import db from "@/utils/drizzle/client";
import { clerkClient } from "@clerk/clerk-sdk-node";

type User = {
	userId: string;
};

const getResume = async ({
	req,
}: Omit<Controller, "next">): Promise<GetResponse<Resume>> => {
	const { resume } = req.query;

	if (!resume) {
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

		const result = (await db.query.resumes.findFirst({
			where: (resumes, { eq }) => eq(resumes.id, resume as string),
			with: {
				skills: true,
				experiences: true,
				user: {
					with: {
						socials: true,
						education: true,
					},
				},
			},
		})) as unknown as Resume;

		if (!result) {
			return Promise.resolve({
				status: StatusCodes.BAD_REQUEST,
				error: "Resume not found",
			});
		}

		result.isEditable = false;
		if (isSignedIn && result) {
			const { userId } = toAuth() as User;

			result.isEditable = userId === result.userId;
		}

		return {
			status: StatusCodes.OK,
			data: result || DEFAULT_RESUME,
		};
	} catch (err) {
		console.log("getting conductors error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

const getResumes = async ({
	req,
}: Omit<Controller, "next">): Promise<GetResponse<Resume[]>> => {
	const DEFAULT_REQUEST: GetResponse<Resume[]> = {
		status: StatusCodes.BAD_REQUEST,
		data: [],
	};

	const { isSignedIn, toAuth } = await clerkClient.authenticateRequest({
		url: `${req.protocol}://${req.hostname}${req.originalUrl}`,
		// @ts-ignore
		headers: req.headers,
	});

	if (!isSignedIn) {
		return Promise.resolve(DEFAULT_REQUEST);
	}

	try {
		const { userId } = toAuth() as User;

		const results = (await db.query.resumes.findMany({
			where: (resumes, { eq }) => eq(resumes.userId, userId),
			columns: {
				userId: false,
			},
			with: {
				skills: true,
				experiences: true,
				user: {
					with: {
						socials: true,
						education: true,
					},
				},
			},
		})) as unknown as Resume[];

		return {
			status: StatusCodes.OK,
			data: results.map((resume) => ({
				...resume,
				isEditable: true,
			})),
		};
	} catch (err) {
		console.log("getResumes error", (err as Error).message);

		return {
			status: StatusCodes.SERVER_ERROR,
			error: (err as Error).message,
		};
	}
};

export { getResume, getResumes };
