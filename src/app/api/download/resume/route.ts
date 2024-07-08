import pkg from "~/package.json";
import puppeteer from "puppeteer";

const isLocal = process.env.NODE_ENV !== "production";

console.log({isLocal})

export async function GET() {
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
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename=${fileName}_resume.pdf`,
    );

    // Return the response with PDF data
    return new Response(pdfBuffer, {
      headers: headers,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);

    return new Response((error as Error).message, { status: 500 });
  }
}
