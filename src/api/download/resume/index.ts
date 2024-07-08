import { normalize } from "@/api/utils";
import type { GetResponse, RequestConfig } from "@/types";
import puppeteer from "puppeteer";
import pkg from "~/package.json";
const isLocal = process.env.APP_ENV !== "production";

const getResume = async ({
	res,
	logger,
}: RequestConfig): Promise<GetResponse["data"]> => {
	let responseBody: GetResponse;

	try {
		const pathname = isLocal
			? "http://ty.lerscott.local:3000"
			: "https://ty.lerscott.com";
		const url = `${pathname}/resume/simple`;

		const browser = await puppeteer.launch();
		const page = await browser.newPage();
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

	return normalize(res)(responseBody);
};

export default getResume;
