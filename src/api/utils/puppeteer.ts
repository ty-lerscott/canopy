import puppeteer, { type Page, type Browser } from "puppeteer";

const runner = async (): Promise<{ page: Page; browser: Browser }> => {
	const browser = await puppeteer.launch({
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		headless: "shell",
	});

	const page = await browser.newPage();

	return {
		page,
		browser,
	};
};

export default runner;
