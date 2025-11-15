import express from 'express';
import { PORT } from "./configurations/appConfig.js";
import { errorHandler } from "./errorHandler/errorHandler.js";
import { bookRouter } from "./routers/bookRouter.js";
import morgan from "morgan";
export const launchServer = (port) => {
    const app = express();
    app.listen(port, () => {
        console.log(`Server runs at http://localhost:${PORT}`);
    });
    //==================Middleware=================
    app.use(express.json());
    app.use(morgan("dev"));
    //===================Router====================
    app.use('/api', bookRouter);
    app.use((req, res) => {
        res.status(404).send("Page not found");
    });
    //==================ErrorHandler===============
    app.use(errorHandler);
};
