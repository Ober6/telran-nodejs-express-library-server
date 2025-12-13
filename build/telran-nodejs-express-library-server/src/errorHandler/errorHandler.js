import { HttpError } from "./HttpError.js";
export const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.status).send(err.message);
    }
    else if (err instanceof Error) {
        res.status(400).send('Uncorrected request ' + err.message);
    }
    else {
        res.status(500).send('Unknown Server Error ' + err);
    }
};
