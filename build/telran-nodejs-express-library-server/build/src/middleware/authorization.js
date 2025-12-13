import { HttpError } from "../errorHandler/HttpError.js";
export const authorize = (pathRoles) => {
    return (req, res, next) => {
        const roles = req.roles;
        const route = req.method + req.path;
        if (!roles || roles.some(r => pathRoles[route].includes(r)))
            next();
        else
            throw new HttpError(403, "");
    };
};
