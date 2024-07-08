import type { Controller } from "@/types";

const DownloadController = ({
	req,
	res,
	next,
	logger,
	pathname,
}: Controller) => {
	const [subject] = pathname;
	switch (subject) {
		case "resume":
			res.send("RESUME");
			break;
		default:
			res.send(`Download: ${subject}`);
			break;
	}
	next();
};

export default DownloadController;
