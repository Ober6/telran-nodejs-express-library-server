import {Response, NextFunction} from "express";
import {AuthRequest, Roles} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {config} from "../configurations/appConfig.js"

const requests = new Map<number, number[]>();

export const rateLimiter = () => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {

        console.log("id:", req.userId);
        console.log("roles:", req.roles);

        if (!req.userId) {
            return next();
        }

        if (req.roles?.includes(Roles.PREMIUM_USER)) {
            return next();
        }

        const userId = req.userId;
        const now = Date.now();
        const windowStart = now - config.rate_limit;

        let userRequests = requests.get(userId) || [];

        userRequests = userRequests.filter(timestamp => timestamp > windowStart);

        if (userRequests.length >= config.max_requests_per_minute) {
            throw new HttpError(403, "Rate limit exceeded for user");
        }

        userRequests.push(now);
        requests.set(userId, userRequests);

        next();
    };
};