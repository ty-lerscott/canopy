import type { Controller } from "@/types";

import getImage from "@/api/image/utils/get-image";
import ogImageTemplate from "./templates/og-image";

const HTMLController = async ({
	query,
	res,
	next,
	extendedPath: [subject],
}: Controller) => {
	res.set({
		"Content-Type": "text/html",
	});

	switch (subject) {
		case "og": {
			const { data, status, error } = await getImage(query?.url as string);

			const html = ogImageTemplate({
				title: query?.title as string,
				image: data?.toString("base64"),
				subtitle: query?.subtitle as string,
			});

			res.set({
				"Content-Length": html.length,
			});

			res.send(error || html);
			break;
		}
		default: {
			break;
		}
	}
	next();
};

export default HTMLController;
