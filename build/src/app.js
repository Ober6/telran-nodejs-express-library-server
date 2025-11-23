import { launchServer } from "./server.js";
import { createSqlPool } from "./configurations/appConfig.js";
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
export const pool = createSqlPool();
console.log("Sql connected");
launchServer();
