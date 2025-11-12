import express from 'express'
import {PORT} from "./configurations/appConfig.js";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {bookRouter} from "./routers/bookRouter.js";

export const launchServer = () => {
    const app = express();
    app.listen(PORT, () => {
        console.log(`Server runs at http://localhost:${PORT}`);
    })

    //==================Middleware=================
    app.use(express.json())

    //===================Router====================
    app.use('/api', bookRouter);

    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

    //==================ErrorHandler===============
    app.use(errorHandler);

}