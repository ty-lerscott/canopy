import dotenv from 'dotenv';
import express from 'express';
import winston from 'winston';

var DownloadController = function (_a) {
    var res = _a.res, next = _a.next, pathname = _a.pathname;
    var subject = pathname[0];
    switch (subject) {
        case "resume":
            res.send("RESUME");
            break;
        default:
            res.send("Download: ".concat(subject));
            break;
    }
    next();
};

var Controller = function (logger) { return function (req, res, next) {
    var _a = req.originalUrl.replace(/^\//, "").split("/"), base = _a[0], pathname = _a.slice(1);
    switch (base) {
        case "download":
            DownloadController({ req: req, res: res, next: next, logger: logger, pathname: pathname });
            break;
        default:
            res.send("HELLO WORLD");
            break;
    }
    next();
}; };

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
//# sourceMappingURL=api.js.map
