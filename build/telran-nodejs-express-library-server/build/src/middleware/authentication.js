var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import { HttpError } from "../errorHandler/HttpError.js";
import { Roles } from "../utils/libTypes.js";
import jwt from "jsonwebtoken";
const BASIC = "Basic ";
const BEARER = "Bearer ";
function getBasicAuth(authHeader, service, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(authHeader);
        const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString('ascii');
        console.log(auth);
        const [id, password] = auth.split(":");
        if (id == process.env.OWNER && password === process.env.OWNER_PASS) {
            req.userId = 100000000;
            req.roles = [Roles.SUPERVISOR];
        }
        else {
            try {
                const account = yield service.getAccount(+id);
                if (bcrypt.compareSync(password, account.passHash)) {
                    req.userId = account._id;
                    req.userName = account.username;
                    req.roles = account.roles || [Roles.READER]; //Todo
                    console.log("Account roles:", account.roles);
                    console.log("Authenticated");
                }
                else {
                    console.log("Not Authenticated");
                }
            }
            catch (e) {
                throw new HttpError(401, "");
            }
        }
    });
}
function getJWTAuth(authHeader, req) {
    const token = authHeader.substring(BEARER.length);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.roles = JSON.parse(payload.roles);
        req.userId = +payload.sub;
        req.userName = "Anonymous";
    }
    catch (e) {
        throw new HttpError(401, "");
    }
}
export const authenticate = (service) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith(BASIC))
            yield getBasicAuth(authHeader, service, req, res);
        else if (authHeader && authHeader.startsWith(BEARER))
            getJWTAuth(authHeader, req);
        next();
    });
};
export const skipRoutes = (skipRoutes) => {
    return (req, res, next) => {
        const route = req.method + req.path;
        console.log(route);
        if (!req.userId && !skipRoutes.includes(route))
            throw new HttpError(401, "skipRoutes throw this error");
        next();
    };
};
