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
describe("AccountServiceImplMongo.checkPassword", () => {
    const service = new AccountServiceImplMongo();
    const mockReader = {
        _id: 123,
        username: "User",
        email: "mail@mail.com",
        birthDate: "2000-01-01",
        passHash: "hashed_pass",
        roles: ["reader"]
    };
    test("Wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
        readerMongooseModel.findById.mockReturnValue({
            lean: () => ({ exec: () => Promise.resolve(mockReader) })
        });
        bcrypt.compareSync.mockReturnValue(false);
        yield expect(service.checkPassword(123, "wrong"))
            .rejects.toThrow("Wrong credentials");
    }));
    test("Correct password", () => __awaiter(void 0, void 0, void 0, function* () {
        readerMongooseModel.findById.mockReturnValue({
            lean: () => ({ exec: () => Promise.resolve(mockReader) })
        });
        bcrypt.compareSync.mockReturnValue(true);
        const result = yield service.checkPassword(123, "pass");
        expect(result._id).toBe(123);
    }));
    afterEach(() => jest.clearAllMocks());
});
