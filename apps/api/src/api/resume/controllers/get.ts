import db from "@/api/drizzle/client";
import type { Controller } from "@/types";
import omit from "object.omit";
// import { clerkClient } from "@clerk/clerk-sdk-node";
// const { isSignedIn } = await clerkClient.authenticateRequest({
// 	url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
// 	headers: req.headers,
// } as Request);
// const resp = await clerkClient.verifyToken(
// 	req.headers.authorization.split(" ")[1],
// );

const DEFAULT_RESUME = {
	user: {
		firstName: "",
		lastName: "",
		profession: "",
		emailAddress: "",
		phoneNumber: "",
		address: "",
		socials: [],
		education: [],
	},
	skills: [],
	experiences: [],
};

const GetResumeController = async ({ req, res }: Controller) => {
	try {
		console.log("Get ResumeController");
		const results = await db.query.resumes.findFirst({
			where: (resumes, { eq }) => eq(resumes.id, req.query.resume),
			columns: {
				id: false,
				userId: false,
			},
			with: {
				skills: {
					columns: {
						id: true,
						name: true,
						endDate: true,
						isActive: true,
						favorite: true,
						startDate: true,
						comfortLevel: true,
					},
				},
				experiences: {
					columns: {
						id: true,
						role: true,
						company: true,
						endDate: true,
						location: true,
						workStyle: true,
						startDate: true,
						body: true,
					},
				},
				user: {
					with: {
						socials: {
							columns: {
								name: true,
								href: true,
							},
						},
						education: {
							columns: {
								id: true,
								school: true,
								degree: true,
								startDate: true,
								endDate: true,
							},
						},
					},
				},
			},
		});

		res.json(results || DEFAULT_RESUME);
	} catch (err) {
		console.log("getting resume error", (err as Error).message);

		res.status(404).end();
	}
};

export default GetResumeController;
