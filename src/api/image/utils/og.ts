import codes from "@/api/utils/status-codes";
import type { GetResponse } from "@/types";
import puppeteer from "puppeteer";
import getImage from "./get-image";
import imageTemplate from "./html-template";

const og = async ({
	url,
	title,
	subtitle,
}: {
	url: string;
	title?: string;
	subtitle?: string;
}): Promise<GetResponse> => {
	const responseBody: GetResponse = {
		status: codes.BAD_REQUEST,
	};
	try {
		const { data: imageBuffer, height, width } = await getImage(url);

		// Launch Puppeteer
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.setViewport({ width, height });

		// Set the page content
		await page.setContent(
			imageTemplate({
				title,
				subtitle,
				image: imageBuffer?.toString("base64") || "",
			}),
		);

		// Remove default white background
		await page.evaluate(() => {
			document.body.style.background = "transparent";
		});

		// Take a screenshot of the container element
		const screenshotBuffer = await page.screenshot({
			omitBackground: true,
		});

		responseBody.data = screenshotBuffer;
		responseBody.headers = {
			"Content-Type": "image/png",
			"Content-Length": screenshotBuffer?.length.toString() || "0",
		};
		responseBody.status = codes.OK;
	} catch (err) {
		console.log("error");
	}

	return responseBody;
};

export default og;
