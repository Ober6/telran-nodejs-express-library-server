import {Request, Response} from "express";
import {Reader, ReaderDto, UpdateReaderDto} from "../model/reader.js";
import {accountServiceMongo} from "../service/impl/AccountServiceImplMongo.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {convertReaderDtoToReader, getRole} from "../utils/tools.js";
import {AuthRequest, Roles} from "../utils/libTypes.js";

class AccountController {
    service = accountServiceMongo;

    createAccount = async (req: Request, res: Response) => {
        const body = req.body as ReaderDto;
        const reader: Reader = convertReaderDtoToReader(body);
        await this.service.createAccount(reader);
        res.status(201).send();
    };

    getAccountById =  async (req: AuthRequest, res: Response) => {
        const id = +req.query.id!;
        if (!id) throw new HttpError(400, "No params");
        if((!req.roles?.includes(Roles.ADMIN) || !req.roles?.includes(Roles.LIBRARIAN)) && id != req.userId!)
            throw new HttpError(403, "Only account owner or Admin can see account");
        const account = await this.service.getAccount(id);
        res.json(account)
    };

    removeAccount  = async (req: Request, res: Response) => {
        const id = +req.query.id!;
        const account = await this.service.removeAccount(id);
        res.json(account)
    };

    changePassword  = async (req: AuthRequest, res: Response) => {
        const {id, oldPassword, newPassword} = req.body;
        if(id != req.userId!) throw new HttpError(403, "Only account owner can change password");
        await this.service.checkPassword(id, oldPassword);
        await this.service.changePassword(id, newPassword);
        res.send("Password changed")
    };

    editAccount  = async (req: Request, res: Response) => {
        const id = +req.query.id!;
        const newReaderData = req.body as UpdateReaderDto;
        const updated = await this.service.editAccount(id, newReaderData);
        res.json(updated);
    };

    addRole = async (req: Request, res: Response) => {
        const newRole = getRole(req.query.role as string);
        const readerId = +req.query.id!;//Todo
        const readerWithNewRole = await this.service.addRole(readerId, newRole);
        res.json(readerWithNewRole);
    };

    login =  async (req: Request, res: Response) => {
        const {id, password} = req.body;
        const token = await this.service.login(id, password);
        res.send(token)
    };
}

export const accountController = new AccountController();