import mysql from "mysql2/promise";
import confJson from "../../config/lib-config.json" with { type: 'json' };
export const config = Object.assign({}, confJson);
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
// export const pathRoles = {
//     //=============Accounting=================
//     "GET/account/byId": [Roles.READER],
//     "PATCH/account/password":[Roles.READER],
//     "PATCH/account/update":[Roles.ADMIN],
//     "DELETE/account":[Roles.SUPERVISOR],
//     "PATCH/account/roles":[Roles.SUPERVISOR],
//     //================Books===================
//     "GET/api/books":[Roles.READER],
//     "POST/api/books":[Roles.LIBRARIAN],
//     "DELETE/api/books":[Roles.LIBRARIAN],
//     "GET/api/books/author":[Roles.READER],
//     "PATCH/api/books/pick":[Roles.LIBRARIAN],
//     "PATCH/api/books/return":[Roles.LIBRARIAN],
// }
