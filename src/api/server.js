// src/api/server.ts
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// src/api/utils/index.ts
import { clsx } from "clsx";
import objectOmit from "object.omit";
var omit = (obj, keyArr) => objectOmit(obj, keyArr);
var cn = (...inputs) => clsx(inputs);

// src/api/logger.ts
import omit2 from "object.omit";
import winston from "winston";
var logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error"
    }),
    new winston.transports.File({ filename: "./logs/combined.log" })
  ]
});
var LoggerController = (req, res, next2) => {
  const query = omit2(req.query, ["auto", "w", "fit", "ixlib", "ixid"]);
  const hasQuery = Object.values(query).some(Boolean);
  const url = req.url.split("?")[0];
  logger.info(`${req.method} ${url}`, hasQuery && { query });
  next2();
};
var logger_default = LoggerController;

// src/api/utils/puppeteer.ts
import puppeteer from "puppeteer";
var runner = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "shell"
  });
  const page = await browser.newPage();
  return {
    page,
    browser
  };
};
var puppeteer_default = runner;

// src/api/download/resume/get.ts
import { config } from "dotenv";

// package.json
var package_default = {
  name: "canopy",
  version: "1.0.0",
  private: true,
  scripts: {
    dev: "NODE_ENV=development tsx watch src/api/server.ts",
    "dev:apps": "PORT=3101 next dev ./src/apps",
    build: "npm run build:apps && NODE_ENV=production tsup",
    "build:apps": "NODE_ENV=production next build ./src/apps",
    start: "node ./src/api/server.js",
    "start:apps": "PORT=3101 next start ./src/apps",
    lint: "biome lint ./src",
    format: "biome format ./src --write",
    check: "biome check ./src",
    tar: 'tar --exclude-vcs --exclude="src/apps/.next" -czvf canopy.tar.gz .',
    zip: 'zip -r canopy.zip . -x "*.git*" -x "*.next*"'
  },
  type: "module",
  author: {
    note: "LET THIS COME FROM THE API REQUEST OR CONTENTFUL",
    name: "Tyler Scott"
  },
  dependencies: {
    "@types/cors": "2.8.17",
    "@types/express": "4.17.21",
    "@types/object.omit": "3.0.3",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    clsx: "2.1.1",
    cors: "2.8.5",
    dotenv: "16.4.5",
    express: "4.19.2",
    jimp: "0.22.12",
    next: "14.2.4",
    "object.omit": "3.0.0",
    postcss: "8.4.39",
    puppeteer: "22.12.1",
    react: "18.3.1",
    "react-dom": "18.3.1",
    tailwindcss: "3.4.4",
    tsup: "8.1.0",
    tsx: "4.16.2",
    winston: "3.13.0"
  },
  devDependencies: {
    "@biomejs/biome": "1.8.3",
    "@types/node": "20",
    typescript: "5.5.3"
  }
};

// src/api/download/resume/get.ts
config({
  path: ".env.local"
});
var isLocal = process.env.APP_ENV === "development";
var getResume = async () => {
  let responseBody;
  try {
    const pathname = isLocal ? "http://ty.lerscott.local:3000" : "https://ty.lerscott.com";
    const url = `${pathname}/resume/simple`;
    const { browser, page } = await puppeteer_default();
    await page.goto(url);
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "1cm",
        left: "1cm",
        right: "1cm",
        bottom: "1cm"
      }
    });
    await browser.close();
    const fileName = package_default.author.name.toLowerCase().replace(/\s/g, "_");
    const headers = {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${fileName}_resume.pdf`
    };
    responseBody = { data: pdfBuffer, headers, status: 200 };
  } catch (error) {
    logger.error("Error generating PDF:", error);
    responseBody = { status: 500, error: error.message };
  }
  return responseBody;
};
var get_default = getResume;

// src/api/download/controller.ts
var DownloadController = async ({ res, next: next2, pathname }) => {
  const [subject] = pathname;
  switch (subject) {
    case "resume": {
      const { data, error, status, headers } = await get_default();
      res.set(headers);
      res.status(status).send(data || error);
      break;
    }
    default: {
      res.send(`Download: ${subject}`);
      break;
    }
  }
  next2();
};
var controller_default = DownloadController;

// src/api/image/utils/get-image.ts
import jimp from "jimp";
var DEFAULT_IMAGE = {
  width: 0,
  height: 0,
  status: 400
};
var BLUR_AMOUNT = Number(process.env.BLUR) || 10;
var getImage = async (url) => {
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
    const err = error;
    logger.error(err.message);
    DEFAULT_IMAGE.error = err.message;
    DEFAULT_IMAGE.status = 500;
  }
  return DEFAULT_IMAGE;
};
var get_image_default = getImage;

// src/api/html/templates/og-image.ts
var Template = ({
  image,
  title,
  subtitle
}) => {
  const imageSrc = `data:image/png;base64,${image}`;
  const cleanedTitle = decodeURIComponent(title || "");
  const cleanedSubtitle = decodeURIComponent(subtitle || "");
  return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Blur Image</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
        			* {
        				line-height: 1;
        			}
                	.Body {
                		background-image: url(${imageSrc});        		
                	}
                	.Title {
                		font-size: 6rem;
                		font-weight: 600;
                	}
                	.Subtitle {
                		font-size: 2.5rem;
                		font-weight: 400;
                		color: #c8c8c8;
                	}
				</style>
            </head>
            <body>
            	<div class="Body bg-no-repeat bg-center bg-cover relative">
            		<div class="flex flex-col justify-center items-center absolute top-0 left-0 right-0 bottom-0 p-8">
						<h1 class="Title text-white text-center mb-4 ${cn(cleanedTitle ? "block" : "hidden")}">${cleanedTitle}</h1>
						<p class="Subtitle text-center ${cn(cleanedSubtitle ? "block" : "hidden")}">${cleanedSubtitle}</p>
					</div>
                	<img class="opacity-0 h-full w-full" src="${imageSrc}" alt="og image" />
                </div>
            </body>
        </html>`;
};
var og_image_default = Template;

// src/api/html/controller.ts
var HTMLController = async ({ query, res, next: next2, pathname }) => {
  const [subject] = pathname;
  res.set({
    "Content-Type": "text/html"
  });
  switch (subject) {
    case "og": {
      const { data, status, error } = await get_image_default(query?.url);
      const html = og_image_default({
        title: query?.title,
        image: data?.toString("base64"),
        subtitle: query.subtitle
      });
      res.set({
        "Content-Length": html.length
      });
      res.send(error || html);
      break;
    }
    default: {
      break;
    }
  }
  next2();
};
var controller_default2 = HTMLController;

// src/api/utils/status-codes.ts
var codes = {
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
  OK: 200
};
var status_codes_default = codes;

// src/api/image/utils/blur.ts
var blur = async (url) => {
  const responseBody = { status: status_codes_default.OK };
  if (!url) {
    console.log("Missing URL");
    responseBody.status = status_codes_default.BAD_REQUEST;
    responseBody.error = "Bad Request: url parameter is required";
    return Promise.resolve(responseBody);
  }
  try {
    const { data } = await get_image_default(url);
    responseBody.data = data;
    responseBody.headers = {
      "Content-Type": "image/png",
      "Content-Length": data?.length.toString() || ""
    };
    responseBody.status = status_codes_default.OK;
  } catch (error) {
    logger.error("Error blurring image:", error);
    responseBody.status = status_codes_default.SERVER_ERROR;
    responseBody.error = error.message;
  }
  return responseBody;
};
var blur_default = blur;

// src/api/image/utils/og.ts
import { config as config2 } from "dotenv";
config2({
  path: ".env.local"
});
var IS_LOCAL = process.env.APP_ENV === "development";
var og = async ({
  url,
  title,
  subtitle
}) => {
  const responseBody = {
    status: status_codes_default.BAD_REQUEST
  };
  try {
    const { data, width, height } = await get_image_default(url);
    const { page, browser } = await puppeteer_default();
    await page.setViewport({ height, width });
    await page.setContent(
      og_image_default({
        image: data?.toString("base64"),
        title,
        subtitle
      })
    );
    const imageBuffer = await page.screenshot({ type: "png" });
    await browser.close();
    responseBody.data = imageBuffer;
    responseBody.headers = {
      "Content-Type": "image/png",
      "Content-Length": imageBuffer?.length.toString() || "0"
    };
    responseBody.status = status_codes_default.OK;
  } catch (err) {
    responseBody.status = status_codes_default.SERVER_ERROR;
    responseBody.error = err.message;
  }
  return responseBody;
};
var og_default = og;

// src/api/image/controller.ts
var ImageController = async ({ query, res, next: next2, pathname }) => {
  const [subject] = pathname;
  switch (subject) {
    case "blur": {
      const { data, error, status, headers } = await blur_default(
        query?.url
      );
      res.set(headers);
      res.status(status).send(data || error);
      break;
    }
    case "og": {
      const { data, error, status, headers } = await og_default({
        url: query?.url,
        title: query?.title,
        subtitle: query?.subtitle
      });
      res.set(headers);
      res.status(status).send(data || error);
      break;
    }
    default: {
      res.send(`Image: ${subject || ""}`);
      break;
    }
  }
  next2();
};
var controller_default3 = ImageController;

// src/api/controllers.ts
var Controller = async (req, res, next2) => {
  const body = req.body;
  const query = omit(req.query, [
    "auto",
    "w",
    "fit",
    "ixlib",
    "ixid"
  ]);
  const [base, ...pathname] = req.originalUrl.split("?")[0].replace(/^\//, "").split("/");
  const props = { body, query, res, next: next2, pathname };
  switch (base) {
    case "download":
      await controller_default(props);
      break;
    case "image":
      await controller_default3(props);
      break;
    case "html":
      await controller_default2(props);
      break;
    default:
      break;
  }
  next2();
};
var controllers_default = Controller;

// src/api/server.ts
import cors from "cors";
import { config as config3 } from "dotenv";
import express from "express";
import next from "next";
config3({
  path: ".env.local"
});
var PORT = process.env.PORT || 3e3;
var IS_LOCAL2 = process.env.NODE_ENV === "development";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var appsDir = resolve(__dirname, "..", IS_LOCAL2 ? "" : "../src", "apps");
var app = next({ dev: IS_LOCAL2, dir: appsDir });
var nextHandler = app.getRequestHandler();
var Server = {
  app,
  async start() {
    await this.app.prepare();
    const server = express();
    server.use(cors());
    server.use(logger_default);
    server.use("/_next", express.static(resolve(__dirname, ".next")));
    server.use((req, res, next2) => {
      const isImageResource = req.url.match(/\/(images)\//);
      if (isImageResource) {
        const newUrl = req.url.substring(
          isImageResource.index,
          req.url.length
        );
        req.url = newUrl;
        req.originalUrl = newUrl;
        express.static("public")(req, res, next2);
      } else {
        next2();
      }
    });
    server.use(controllers_default);
    server.get("*", (req, res) => {
      return nextHandler(req, res);
    });
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  }
};
(async () => {
  await Server.start();
})();
