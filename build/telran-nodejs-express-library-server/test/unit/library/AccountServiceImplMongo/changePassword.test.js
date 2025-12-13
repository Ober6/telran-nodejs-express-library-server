var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AccountServiceImplMongo } from "../../../../src/service/impl/AccountServiceImplMongo.js";
import { readerMongooseModel } from "../../../../src/dbSchemas/readerMongooseSchema.js";
import bcrypt from "bcryptjs";
jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");
jest.mock("bcryptjs");
describe("AccountServiceImplMongo.changePassword", () => {
    const service = new AccountServiceImplMongo();
    test("Failed test: account not found", () => __awaiter(void 0, void 0, void 0, function* () {
        readerMongooseModel.findById.mockResolvedValue(null);
        yield expect(service.changePassword(123, "newPass"))
            .rejects.toThrow("Account not found");
    }));
    test("Passed test", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAccount = {
            passHash: "",
            save: jest.fn().mockResolvedValue(undefined)
        };
        readerMongooseModel.findById.mockResolvedValue(mockAccount);
        bcrypt.hashSync.mockReturnValue("hashed_pass");
        yield expect(service.changePassword(123, "newPass"))
            .resolves.toBeUndefined();
        expect(mockAccount.passHash).toBe("hashed_pass");
        expect(mockAccount.save).toHaveBeenCalled();
    }));
    afterEach(() => jest.clearAllMocks());
});
