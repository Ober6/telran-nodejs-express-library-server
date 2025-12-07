var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import { HttpError } from "../../errorHandler/HttpError.js";
import { readerMongooseModel } from "../../dbSchemas/readerMongooseSchema.js";
import { getJWT } from "../../utils/tools.js";
export class AccountServiceImplMongo {
    changePassword(id, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id, newPassword);
            const account = yield readerMongooseModel.findById(id);
            if (!account)
                throw new HttpError(404, "Account not found");
            const newHash = bcrypt.hashSync(newPassword, 10);
            account.passHash = newHash;
            yield account.save();
        });
    }
    createAccount(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const temp = yield readerMongooseModel.findById(reader._id);
            if (temp)
                throw new HttpError(409, "Reader already exists");
            const readerDoc = new readerMongooseModel(reader);
            yield readerDoc.save();
        });
    }
    editAccount(id, updReader) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(updReader);
            const result = yield readerMongooseModel.findByIdAndUpdate(id, {
                username: updReader.username,
                email: updReader.email,
                birthdate: updReader.birthDate
            }, { new: true });
            if (!result)
                throw new HttpError(404, "Account not found");
            const { _id, username, email, passHash, birthDate, roles } = result;
            return { _id, username, email, passHash, birthDate, roles };
        });
    }
    getAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield readerMongooseModel.findById(id).lean().exec();
            if (!result)
                throw new HttpError(404, "Account not found");
            const { _id, username, email, passHash, birthDate, roles } = result;
            return { _id, username, email, passHash, birthDate, roles };
        });
    }
    removeAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield readerMongooseModel.findByIdAndDelete(id);
            if (!result)
                throw new HttpError(404, "Account not found");
            const { _id, username, email, passHash, birthDate, roles } = result;
            return { _id, username, email, passHash, birthDate, roles };
        });
    }
    checkPassword(id, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.getAccount(id);
            console.log(account);
            if (!bcrypt.compareSync(pass, account.passHash))
                throw new HttpError(401, "Wrong credentials");
            return account;
        });
    }
    addRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield readerMongooseModel.findById(id);
            if (!account)
                throw new HttpError(404, "");
            account.roles.push(role);
            account.save();
            return account;
        });
    }
    login(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.checkPassword(id, password);
            const token = getJWT(id, account.roles);
            return token;
        });
    }
}
export const accountServiceMongo = new AccountServiceImplMongo();
