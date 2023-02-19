import config from "./config"
import express from 'express';
import * as fs from 'fs';
import bodyParser from 'body-parser';
import * as swaggerUI from "swagger-ui-express";
import * as swaggerJson from "./swagger.json";
import cors from 'cors';
import { RegisterRoutes } from "./routes";


(async () => {
    const port = 3001;
    // Server config
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(function logMethod(req, res, next) {
        console.log(`POST ${req.originalUrl}`, req.headers["x-real-ip"], new Date());
        next(); return;
        if("165.22.28.98" === req.headers["x-real-ip"]){
            res.status(429);
            res.json({status:429, message: "too many requests."})
        }else{
            next()
        }
    });
    app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(swaggerJson));
    RegisterRoutes(app);
    app.listen(port, "0.0.0.0", async () => {
        console.log("Config:")
        Object.entries(config).forEach(configEntry => {
            if (['string', 'number'].includes(typeof configEntry[1]))
                console.log(configEntry[0], configEntry[1]);
        })
        console.log(`⚡️[server]: Server is running at http://localhost:${port}/docs/`);
    });
})()