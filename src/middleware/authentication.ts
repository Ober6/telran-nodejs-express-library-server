import {AccountService} from "../service/AccountService.js";
import {NextFunction, Request, Response} from "express";
import bcrypt from "bcryptjs";
import {HttpError} from "../errorHandler/HttpError.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";

const BASIC = "Basic ";

async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response) {
    console.log(authHeader);
    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString('ascii');
    console.log(auth);
    const [id, password] = auth.split(":");
    if(id == process.env.OWNER && password === process.env.OWNER_PASS){
        req.userId = 100000000;
        req.roles = [Roles.SUPERVISOR]
    } else {
        try {
            const account = await service.getAccount(+id);
            if (bcrypt.compareSync(password, account.passHash)) {
                req.userId = account._id;
                req.userName = account.username;
                req.roles = account.roles || [Roles.READER]; //Todo

                console.log("Authenticated")
            } else {
                console.log("Not Authenticated")
            }
        } catch (e) {
            throw new HttpError(401,"");
        }
    }
}

export const authenticate = (service:AccountService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        if (authHeader)
            await getBasicAuth(authHeader, service, req, res);
        next();
    }
}

export const skipRoutes = (skipRoutes: string[]) => {
    return (req:AuthRequest, res:Response, next:NextFunction) => {
        const route = req.method + req.path;
        console.log(route);
        if(!req.userId && !skipRoutes.includes(route))
            throw new HttpError(401, "skipRoutes throw this error")
        next();
    }
}