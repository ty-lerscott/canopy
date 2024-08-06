import cors from "cors";
import helmet from "helmet";
import winston from "winston";
import omit from "object.omit";
import {resolve} from 'node:path';
import merge from 'lodash.mergewith'
import bodyParser from "body-parser";
import {config} from "@dotenvx/dotenvx";
import express, { type NextFunction, type Request, type Response} from 'express'

const env = config().parsed as Record<string, string>;
const server = express();
const IS_LOCAL = env.VITE_APP_ENV === 'development';
const PORT = env.PORT || 3000;
const urlEncoded = bodyParser.urlencoded({
    extended: true,
});

const LoggerController = (req: Request, _res: Response, next: NextFunction) => {
    const query = omit(req.query, ["auto", "w", "fit", "ixlib", "ixid"]);
    const hasQuery = Object.values(query).some(Boolean);
    const [url] = req.url.split("?");

    if (!/^\/(monitoring|_next|images|favicon)/.test(url)) {
        winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: "./logs/error.log",
                    level: "error",
                }),
                new winston.transports.File({ filename: "./logs/combined.log" }),
            ],
        }).info(`${req.method} ${url}`, hasQuery && { query });
    }

    next();
};

const start = () => {
    server.use(express.static(resolve(process.cwd(), 'dist')));
    server.use(cors());
    server.use(LoggerController)
    server.use(helmet({
        contentSecurityPolicy: {
            directives: merge({}, Object.entries(helmet.contentSecurityPolicy.getDefaultDirectives()).reduce((acc, [key, valueArr]) => {
                const valArr = valueArr as string[];

                acc[key] = ['object-src', 'upgrade-insecure-requests', 'script-src-attr'].includes(key) ? valArr : valArr.concat([env.CLERK_API_URL, `https://canopy.lerscott.${IS_LOCAL ? 'local' : 'com'}`, "https://clerk.lerscott.com"]);

                return acc;
            }, {} as Record<string, string[]>), {
                'worker-src':["'self'", "blob:", env.CLERK_API_URL],
                'img-src':["'self'", "https://img.clerk.com"],
            })
        }
    }));

    server.use(bodyParser.json());
    server.use(urlEncoded);

    server.get('*', (_req, res) => {
        res.sendFile(resolve(process.cwd(), 'dist', 'index.html'));
    });

    server.listen(PORT, (err?: Error) => {
        if (err) throw err;
        console.log(
            `> Ready on https://resume.lerscott.${IS_LOCAL ? 'local' : "com"}`,
        );
    });
}

start();