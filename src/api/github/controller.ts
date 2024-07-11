import type { Controller } from "@/types";

const GithubController = async ({ body, res, next, pathname }: Controller) => {
	const [subject] = pathname;

	console.group("GITHUB CONTROLLERR");
	console.dir(body, { depth: null });
	console.groupEnd();

	switch (subject) {
		default: {
			res.status(200);
			res.end();
			break;
		}
	}
	next();
};

export default GithubController;
