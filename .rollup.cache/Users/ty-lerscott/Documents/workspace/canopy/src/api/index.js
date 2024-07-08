import Controller from "@/api/utils/controllers";
import dotenv from "dotenv";
import express from "express";
import winston from "winston";
dotenv.config({
    path: ".env.local",
});
var logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});
var Logger = function (req, res, next) {
    logger.info("".concat(req.method, " ").concat(req.url));
    next();
};
var app = express();
app.use(Logger);
app.get("*", Controller(logger));
app.listen(Number(process.env.PORT) || 3000, function () {
    return console.log("Server is listening on port ".concat(Number(process.env.PORT)));
});
//# sourceMappingURL=index.js.map