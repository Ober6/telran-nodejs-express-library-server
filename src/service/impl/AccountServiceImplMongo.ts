import {AccountService} from "../AccountService.js";
import {Reader, UpdateReaderDto} from "../../model/reader.js";
import bcrypt from "bcryptjs";
import {HttpError} from "../../errorHandler/HttpError.js";
import {readerMongooseModel} from "../../dbSchemas/readerMongooseSchema.js";
import {Roles} from "../../utils/libTypes.js";
import {getJWT} from "../../utils/tools.js"

class AccountServiceImplMongo implements AccountService{
    async changePassword(id: number, newPassword: string): Promise<void> {
        console.log(id, newPassword)
        const account = await readerMongooseModel.findById(id);
        if (!account) throw new HttpError(404, "Account not found");

        const newHash = bcrypt.hashSync(newPassword, 10);
        account.passHash = newHash;
        await account.save();
    }

    async createAccount(reader: Reader): Promise<void> {
        const temp = await readerMongooseModel.findById(reader._id);
        if (temp) throw new HttpError(409, "Reader already exists");
        const readerDoc = new readerMongooseModel(reader);
        await readerDoc.save();
    }

    async editAccount(id: number, updReader: UpdateReaderDto): Promise<Reader> {
        console.log(updReader)
        const result =
            await readerMongooseModel.findByIdAndUpdate(id, {
                username: updReader.username,
                email: updReader.email,
                birthdate: updReader.birthDate
            }, {new: true})
        if (!result) throw new HttpError(404, "Account not found");
        const {_id, username, email, passHash, birthDate, roles } = result;
        return {_id, username, email, passHash, birthDate, roles }

    }

    async getAccount(id: number): Promise<Reader> {
        const result = await readerMongooseModel.findById(id).lean().exec();
        if (!result) throw new HttpError(404, "Account not found");
        const {_id, username, email, passHash, birthDate, roles} = result;
        return {_id, username, email, passHash, birthDate, roles }
    }

    async removeAccount(id: number): Promise<Reader> {
        const result = await readerMongooseModel.findByIdAndDelete(id);
        if (!result) throw new HttpError(404, "Account not found");
        const {_id, username, email, passHash, birthDate, roles} = result;
        return {_id, username, email, passHash, birthDate, roles }
    }

    async checkPassword(id: number, pass: string) {
        const account = await this.getAccount(id);
        console.log(account)
        if(!bcrypt.compareSync(pass, account.passHash))
            throw new HttpError(401, "Wrong credentials")
        return account;
    }

    async addRole(id: number, role: Roles): Promise<Reader> {
        const account = await readerMongooseModel.findById(id);
        if(!account) throw new HttpError(404,"");
        account.roles.push(role);
        account.save();
        return account as Reader;
    }

    async login(id: number, password: string): Promise<string> {
        const account = await this.checkPassword(id, password)
        const token = getJWT(id, account.roles)
        return token;
    }
}

export const accountServiceMongo = new AccountServiceImplMongo();