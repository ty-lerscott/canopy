import type { Controller } from "@/types";

/**
 * user authentication + resume id
 * @constructor
 */
const GetResumeController = async ({ res }: Controller) => {
	res.send("GET RESUME");
};

export default GetResumeController;
