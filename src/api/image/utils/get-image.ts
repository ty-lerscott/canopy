import { logger } from "@/api/logger";
import jimp from "jimp";

type JimpImage = {
	data?: Buffer;
	width: number;
	height: number;
};

const DEFAULT_IMAGE: JimpImage = {
	width: 0,
	height: 0,
};

const BLUR_AMOUNT = Number(process.env.BLUR) || 10;

const getImage = async (url: string): Promise<JimpImage> => {
	if (!url) {
		return Promise.resolve(DEFAULT_IMAGE);
	}

	const decoded = decodeURIComponent(url);

	try {
		// Resize the image to a smaller size for faster processing
		const image = await jimp.read(decoded);

		image.blur(BLUR_AMOUNT);

		DEFAULT_IMAGE.data = await image.getBufferAsync(jimp.MIME_PNG);
		DEFAULT_IMAGE.width = image.getWidth();
		DEFAULT_IMAGE.height = image.getHeight();
	} catch (error) {
		logger.error((error as Error).message);
	}

	return DEFAULT_IMAGE;
};

export default getImage;
