import { logger } from "@/api/utils/logger";
import type { Controller } from "@/types";

import blurImage from "./utils/blur";
import getOGImage from "./utils/og";

const ImageController = async ({ query, res, next, pathname }: Controller) => {
	const [subject] = pathname;

	switch (subject) {
		case "blur": {
			const { data, error, status, headers } = await blurImage(
				query?.url as string,
			);

			res.set(headers);
			res.status(status).send(data || error);
			break;
		}
		case "og": {
			const { data, error, status, headers } = await getOGImage({
				url: query?.url as string,
				title: query?.title as string,
				subtitle: query?.subtitle as string,
			});

			res.set(headers);
			res.status(status).send(data || error);
			break;
		}
		default: {
			res.send(`Image: ${subject || ""}`);
			break;
		}
	}
	next();
};

export default ImageController;
