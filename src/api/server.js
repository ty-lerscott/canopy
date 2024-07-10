import {
  controllers_default
} from "../chunk-WQNNI6XO.js";
import {
  logger_default
} from "../chunk-TLAM4LCM.js";

// src/api/server.ts
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import next from "next";
config({
  path: ".env.local"
});
var PORT = "3100";
var IS_LOCAL = true;
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var appsDir = resolve(__dirname, "..", IS_LOCAL ? "" : "../src", "apps");
var app = next({ dev: IS_LOCAL, dir: appsDir });
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
