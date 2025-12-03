import mysql from "mysql2/promise";
import { Roles } from "../utils/libTypes.js";
// export  const PORT = 3050;
export const DB = "mongodb+srv://telran6prac_db_user:fym69LVhpwOQhtbP@cluster0.yqszp3e.mongodb.net/library?appName=Cluster0";
export const createSqlPool = () => {
    return mysql.createPool({
        host: process.env.SQL_HOST,
        port: +process.env.SQL_PORT,
        user: process.env.SQL_USER || "root",
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME
    });
};
export const skipRoutesArr = ["POST/account", "POST/account/login"];
export const pathRoles = {
    "GET/account/byId": [Roles.READER],
    "PATCH/account/password": [Roles.READER],
    "PATCH/account/update": [Roles.ADMIN],
    "DELETE/account": [Roles.SUPERVISOR],
    "PATCH/account/roles": [Roles.SUPERVISOR]
};
