import type { Conductor } from "@/types";
import blurImage from "./conductors/blur-image";
import getOGImage from "./conductors/open-graph";

const ImageController = async ({
	res,
	next,
	req: {
		query,
		extendedPath: [subject],
	},
}: Conductor) => {
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
