import { launchServer } from "./server.js";
import * as mongoose from "mongoose";
// import {createSqlPool, DB} from "./configurations/appConfig.js";
import dotenv from "dotenv";
//
// mongoose.connect(db!)
//     .then(() => {
//         console.log("Connected to database");
//         launchServer(+port);
//     })
//     .catch(err => {
//         console.error("DB connection error:", err);
//     });
dotenv.config();
// export const pool = createSqlPool();
// console.log("Sql connected")
mongoose.connect(process.env.ACCOUNT_DB).then(() => {
    console.log("Mongo db connected");
    launchServer();
}).catch(err => {
    console.log("Mongo connection failed");
});
// launchServer()
