import {AccountService} from "../AccountService.js";
import {Reader, UpdateReaderDto} from "../../model/reader.js";
import {readerMongooseModel} from "../../dbSchemas/readerMongooseSchema.js";

import {v4 as uuidv4} from "uuid";
import {HttpError} from "../../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";

class AccountServiceImplMongo implements AccountService{
    async changePassword(id: number, newPassword: string): Promise<void> {
        const reader = await readerMongooseModel.findById(id).exec();
        if(!reader) throw new HttpError(409, `Account with id ${id} not exists`);

        const salt = bcrypt.genSaltSync(10);

        reader.passHash = bcrypt.hashSync(newPassword, salt);
        await reader.save();
    }

    async createAccount(reader: Reader): Promise<void> {
        await readerMongooseModel.create(reader);
    }

    async editAccount(id: number, newReaderData: UpdateReaderDto): Promise<Reader> {
        const reader = await readerMongooseModel.findById(id).exec();
        if(!reader) throw new HttpError(409, `Account with id ${id} not exists`);

        reader.username  = newReaderData.username;
        reader.email     = newReaderData.email;
        reader.birthDate = newReaderData.birthDate;

        await reader.save();
        return reader;
    }

    async getAccount(id: number): Promise<Reader> {
        const reader = await readerMongooseModel.findById(id).exec();
        if(!reader) throw new HttpError(409, `Account with id ${id} not exists`);

        return reader;
    }

    async removeAccount(id: number): Promise<Reader> {
        const reader = await readerMongooseModel.findByIdAndDelete(id).exec();
        if(!reader) throw new HttpError(409, `Account with id ${id} not exists`);

        return reader;
    }
}

export const accountServiceMongo = new AccountServiceImplMongo();