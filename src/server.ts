import express from 'express'
import {PORT} from "./configurations/appConfig.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {bookRouter} from "./routers/bookRouter.js";
import morgan from "morgan";
import * as fs from "node:fs";
//import dotenv from "dotenv";
export const launchServer = () => {
    const app = express();

    // app.listen(PORT, () => {
    //     console.log(`Server runs at http://localhost:${PORT}`);
    // })
    //dotenv.config();
    app.listen(process.env.PORT, () => {
        console.log(`Server runs at http://localhost:${process.env.PORT}`);
    })
    const logStream = fs.createWriteStream('app.log',{flags:'a'})
    //==================Middleware=================
    app.use(express.json())
    app.use(morgan('combined'))
    app.use(morgan('common', {stream: logStream}))
    //winston
    //pino
    //Log4js
    //===================Router====================
    app.use('/api/books', bookRouter);

    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

    //==================ErrorHandler===============
    app.use(errorHandler);

}