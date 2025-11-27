import {Request, Response} from "express";
import {Reader, ReaderDto, UpdateReaderDto} from "../model/reader.js";
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
    getAccountById =  async (req:Request, res:Response) => {
        const id = +req.query.id!;
        if(!id) throw  new HttpError(400, "No params");
        const reader = await this.service.getAccount(id);
        res.json(reader)
    };
    removeAccount  = async (req:Request, res:Response) => {
        const id =  +req.query.id!
        if(!id) throw  new HttpError(400, "No params");

        const removed = await this.service.removeAccount(id);
        res.json(removed);
    };
    changePassword  = async (req:Request, res:Response) => {
        const id = +req.body.id;
        const newPassword = req.body.newPassword;

        if(!id) throw  new HttpError(400, "No id param");
        if(!newPassword) throw  new HttpError(400, "No password param");

        await this.service.changePassword(id, newPassword);
        res.status(200).send();
    };
    editAccount  = async (req:Request, res:Response) => {
        const id = +req.body.id;
        const newData = req.body as UpdateReaderDto;

        if (!id) throw new HttpError(400, "No id param");
        if (!newData.username || !newData.email || !newData.birthDate) {
            throw new HttpError(400, "No params");
        }

        const updated = await this.service.editAccount(id, newData);
        res.json(updated);
    };


}

export const accountController = new AccountController();