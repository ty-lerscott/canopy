import { logger } from "@/api/utils/logger";
import puppeteer from "@/api/utils/puppeteer";
import StatusCodes from "@/api/utils/status-codes";
import type { GetResponse } from "@/types";

const isLocal = process.env.APP_ENV === "development";

const getResume = async (resumeId: string): Promise<GetResponse> => {
	let responseBody: GetResponse;

	if (!resumeId) {
		responseBody = {
			status: StatusCodes.BAD_REQUEST,
			error: "Resume id is required",
		};

		return responseBody;
	}

	try {
		const pathname = isLocal
			? "http://resume.lerscott.local:3101/resume"
			: "https://resume.lerscott.com/resume";

		const { browser, page } = await puppeteer();

		await page.goto(`${pathname}/${resumeId}?print=true`);
		await page.waitForSelector('[data-testid="Page-Resume"]', {
			timeout: 5000,
		});

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

		const headers = {
			"Content-Type": "application/pdf",
			"Content-Disposition": `attachment; filename=resume.pdf`,
		};

		responseBody = { data: pdfBuffer, headers, status: StatusCodes.OK };
	} catch (error) {
		logger.error("Error generating PDF:", error);

		responseBody = {
			status: StatusCodes.SERVER_ERROR,
			error: (error as Error).message,
		};
	}

	return responseBody;
};

export default getResume;
