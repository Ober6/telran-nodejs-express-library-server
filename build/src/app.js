import 'dotenv/config';
import { launchServer } from "./server.js";
import * as mongoose from "mongoose";
const db = process.env.MONGO_URI;
const port = process.env.PORT || 3050;
mongoose.connect(db)
    .then(() => {
    console.log("Connected to database");
    launchServer(+port);
})
    .catch(err => {
    console.error("DB connection error:", err);
});
