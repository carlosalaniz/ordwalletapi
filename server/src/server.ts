import config from "./config"
import {
    default as express,
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from 'express';
import bodyParser from 'body-parser';
import * as swaggerUI from "swagger-ui-express";
import * as swaggerJson from "./swagger.json";
import cors from 'cors';
import { RegisterRoutes } from "./routes";
import { ValidateError } from "tsoa";
import { KnownError } from "./authentication";
import serveStatic from 'serve-static';
import history from 'connect-history-api-fallback';



(async () => {
    const port = 3005;
    // Server config
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(function logMethod(req, res, next) {
        console.log(`POST ${req.originalUrl}`, req.headers["x-real-ip"], new Date());
        next(); return;
        if ("165.22.28.98" === req.headers["x-real-ip"]) {
            res.status(429);
            res.json({ status: 429, message: "too many requests." })
        } else {
            next()
        }
    });
    if (config.RUN_AS === "DEBUG") {
        app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(swaggerJson));
    }

    RegisterRoutes(app);


    const distVue = __dirname + "/../../client/dist";
    app.use(history());
    app.use(serveStatic(distVue));
    app.get('/', (req, res) => {
        res.sendFile(distVue + '/index.html');
    })
    app.use(function errorHandler(
        err: unknown,
        req: ExRequest,
        res: ExResponse,
        next: NextFunction
    ): ExResponse | void {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(422).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }
        if (err instanceof KnownError) {
            return res.status(400).json(err.message);
        }
        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }

        next();
    });
    const server = app.listen(port, "0.0.0.0", async () => {
        console.log("Config:")
        Object.entries(config).forEach(configEntry => {
            if (['string', 'number'].includes(typeof configEntry[1]))
                console.log(configEntry[0], configEntry[1]);
        })
        console.log(`⚡️[server]: Server is running at http://localhost:${port}/docs/`);
    });
    server.timeout = 300000;
})()