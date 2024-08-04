import type { GetResponse } from "@/types";
import { logger } from "@/utils/logger";
import jimp from "jimp";

type JimpImage = GetResponse & {
	data?: Buffer;
	width: number;
	height: number;
	error?: string;
};

const DEFAULT_IMAGE: JimpImage = {
	width: 0,
	height: 0,
	status: 400,
};

const BLUR_AMOUNT = Number(process.env.BLUR) || 10;

const getImage = async (url: string): Promise<JimpImage> => {
	if (!url) {
		return Promise.resolve(DEFAULT_IMAGE);
	}

	const decoded = decodeURIComponent(url).replace(/["\/]$/, "");

	try {
		const image = await jimp.read(decoded);

		image.blur(BLUR_AMOUNT);

		DEFAULT_IMAGE.data = await image.getBufferAsync(jimp.MIME_PNG);
		DEFAULT_IMAGE.width = image.getWidth();
		DEFAULT_IMAGE.height = image.getHeight();
		DEFAULT_IMAGE.status = 200;
	} catch (error) {
		const err = error as Error;
		logger.error(err.message);
		DEFAULT_IMAGE.error = err.message;
		DEFAULT_IMAGE.status = 500;
	}

	return DEFAULT_IMAGE;
};

export default getImage;
