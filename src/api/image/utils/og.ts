import ogImageTemplate from "@/api/html/templates/og-image";
import getImage from "@/api/image/utils/get-image";
import puppeteer from "@/api/utils/puppeteer";
import codes from "@/api/utils/status-codes";
import type { GetResponse } from "@/types";

const og = async ({
	url,
	title,
	subtitle,
}: {
	url: string;
	title?: string;
	subtitle?: string;
}): Promise<GetResponse> => {
	const responseBody: GetResponse<Buffer> = {
		status: codes.BAD_REQUEST,
	};
	try {
		const { data, width, height } = await getImage(url);

		const { page, browser } = await puppeteer();
		await page.setViewport({ height, width });
		await page.setContent(
			ogImageTemplate({
				image: data?.toString("base64"),
				title,
				subtitle,
			}),
		);

		const imageBuffer = await page.screenshot({ type: "png" });
		await browser.close();

		responseBody.data = imageBuffer;
		responseBody.headers = {
			"Content-Type": "image/png",
			"Content-Length": imageBuffer?.length.toString() || "0",
		};
		responseBody.status = codes.OK;
	} catch (err) {
		responseBody.status = codes.SERVER_ERROR;
		responseBody.error = (err as Error).message;
	}

	return responseBody;
};

export default og;
