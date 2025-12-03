import {AuthRequest, Roles} from "../utils/libTypes.js";
import {Response, NextFunction} from "express";
import {HttpError} from "../errorHandler/HttpError.js";

export const authorize = (pathRoles:Record<string, Roles[]>) => {
    return (req:AuthRequest, res:Response, next:NextFunction) => {
        const roles = req.roles;
        const route = req.method + req.path;
        if(!roles || roles.some(r => pathRoles[route].includes(r)))
            next();
        else throw  new HttpError(403, "");
    }
}