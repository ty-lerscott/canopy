import { logger } from "@/api/logger";
import puppeteer from "@/api/utils/puppeteer";
import env from "@/tools/dotenv-config";
import type { GetResponse } from "@/types";
import pkg from "~/package.json";

const isLocal = env.APP_ENV === "development";

const getResume = async (): Promise<GetResponse> => {
	let responseBody: GetResponse;

	try {
		const pathname = isLocal
			? "http://ty.lerscott.local:3000"
			: "https://ty.lerscott.com";
		const url = `${pathname}/resume/simple`;

		const { browser, page } = await puppeteer();

		await page.goto(url);
		const pdfBuffer = await page.pdf({
			format: "A4",
			margin: {
				top: "1cm",
				left: "1cm",
				right: "1cm",
				bottom: "1cm",
			},
		});
		await browser.close();

		const fileName = pkg.author.name.toLowerCase().replace(/\s/g, "_");
		const headers = {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename=${fileName}_resume.pdf`,
		};

		responseBody = { data: pdfBuffer, headers, status: 200 };
	} catch (error) {
		logger.error("Error generating PDF:", error);

		responseBody = { status: 500, error: (error as Error).message };
	}

	return responseBody;
};

export default getResume;
