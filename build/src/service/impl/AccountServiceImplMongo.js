var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readerMongooseModel } from "../../dbSchemas/readerMongooseSchema.js";
import { HttpError } from "../../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
class AccountServiceImplMongo {
    changePassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield readerMongooseModel.findById(id).exec();
            if (!reader)
                throw new HttpError(409, `Account with id ${id} not exists`);
            const salt = bcrypt.genSaltSync(10);
            reader.passHash = bcrypt.hashSync(newPassword, salt);
            yield reader.save();
        });
    }
    createAccount(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            yield readerMongooseModel.create(reader);
        });
    }
    editAccount(id, newReaderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield readerMongooseModel.findById(id).exec();
            if (!reader)
                throw new HttpError(409, `Account with id ${id} not exists`);
            reader.username = newReaderData.username;
            reader.email = newReaderData.email;
            reader.birthDate = newReaderData.birthDate;
            yield reader.save();
            return reader;
        });
    }
    getAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield readerMongooseModel.findById(id).exec();
            if (!reader)
                throw new HttpError(409, `Account with id ${id} not exists`);
            return reader;
        });
    }
    removeAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = yield readerMongooseModel.findByIdAndDelete(id).exec();
            if (!reader)
                throw new HttpError(409, `Account with id ${id} not exists`);
            return reader;
        });
    }
}
export const accountServiceMongo = new AccountServiceImplMongo();
