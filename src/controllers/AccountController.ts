import {Request, Response} from "express";
import {Reader, ReaderDto} from "../model/reader.js";
import {accountServiceMongo} from "../service/impl/AccountServiceImplMongo.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {convertReaderDtoToReader} from "../utils/tools.js";

class AccountController {
    service = accountServiceMongo;

    createReader = async (req: Request, res: Response) => {
        const body = req.body as ReaderDto;
        const reader: Reader = convertReaderDtoToReader(body);
        await this.service.createAccount(reader);
        res.status(201).send();
    };
    getAccountById =  (req:Request, res:Response) => {
        const id = +req.query.id!;
        if(!id) throw  new HttpError(400, "No params");
        const reader = this.service.getAccount(id);
        res.json(reader)
    };
    removeAccount  = (req:Request, res:Response) => {

    };
    changePassword  = (req:Request, res:Response) => {

    };
    editAccount  = (req:Request, res:Response) => {

    };


}

export const accountController = new AccountController();