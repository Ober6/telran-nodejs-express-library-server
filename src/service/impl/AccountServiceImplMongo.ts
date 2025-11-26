import {AccountService} from "../AccountService.js";
import {Reader, UpdateReaderDto} from "../../model/reader.js";

class AccountServiceImplMongo implements AccountService{
    changePassword(id: number, newPassword: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    createAccount(reader: Reader): Promise<void> {
        return Promise.resolve(undefined);
    }

    editAccount(id: number, newReaderData: UpdateReaderDto): Promise<Reader> {
        throw ""
    }

    getAccount(id: number): Promise<Reader> {
        throw ""
    }

    removeAccount(id: number): Promise<Reader> {
        throw ""
    }

}

export const accountServiceMongo = new AccountServiceImplMongo();