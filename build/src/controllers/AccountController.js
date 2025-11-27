var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { accountServiceMongo } from "../service/impl/AccountServiceImplMongo.js";
import { HttpError } from "../errorHandler/HttpError.js";
import { convertReaderDtoToReader } from "../utils/tools.js";
class AccountController {
    constructor() {
        this.service = accountServiceMongo;
        this.createReader = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const reader = convertReaderDtoToReader(body);
            yield this.service.createAccount(reader);
            res.status(201).send();
        });
        this.getAccountById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.query.id;
            if (!id)
                throw new HttpError(400, "No params");
            const reader = yield this.service.getAccount(id);
            res.json(reader);
        });
        this.removeAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.query.id;
            if (!id)
                throw new HttpError(400, "No params");
            const removed = yield this.service.removeAccount(id);
            res.json(removed);
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.body.id;
            const newPassword = req.body.newPassword;
            if (!id)
                throw new HttpError(400, "No id param");
            if (!newPassword)
                throw new HttpError(400, "No password param");
            yield this.service.changePassword(id, newPassword);
            res.status(200).send();
        });
        this.editAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.body.id;
            const newData = req.body;
            if (!id)
                throw new HttpError(400, "No id param");
            if (!newData.username || !newData.email || !newData.birthDate) {
                throw new HttpError(400, "No params");
            }
            const updated = yield this.service.editAccount(id, newData);
            res.json(updated);
        });
    }
}
export const accountController = new AccountController();
