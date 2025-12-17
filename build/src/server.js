import express from 'express';
import { config } from "./configurations/appConfig.js";
import { errorHandler } from "./errorHandler/errorHandler.js";
import { bookRouter } from "./routers/bookRouter.js";
import morgan from "morgan";
import * as fs from "node:fs";
import { accountRouter } from "./routers/accountRouter.js";
import { authenticate, skipRoutes } from "./middleware/authentication.js";
import { accountServiceMongo } from "./service/impl/AccountServiceImplMongo.js";
import { authorize } from "./middleware/authorization.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
//import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../docs/library-openapi.json" with { type: "json" };
export const launchServer = () => {
    const app = express();
    // app.listen(PORT, () => {
    //     console.log(`Server runs at http://localhost:${PORT}`);
    // })
    //dotenv.config();
    app.listen(config.port, () => {
        console.log(`Server runs at http://localhost:${config.port}`);
    });
    const logStream = fs.createWriteStream('app.log', { flags: 'a' });
    //==================OpenApi Docs===============
    app.use('docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
        swaggerOptions: {
            supportedSubmitMethods: []
        }
    }));
    //==================Middleware=================
    app.use(authenticate(accountServiceMongo));
    app.use(skipRoutes(config.skipRoutesArr));
    app.use(rateLimiter());
    app.use(authorize(config.pathRoles));
    app.use(express.json());
    app.use(morgan('combined'));
    app.use(morgan('common', { stream: logStream }));
    //winston
    //pino
    //Log4js
    //===================Router====================
    app.use('/api/books', bookRouter);
    app.use('/account', accountRouter);
    app.use((req, res) => {
        res.status(404).send("Page not found");
    });
    //==================ErrorHandler===============
    app.use(errorHandler);
};
