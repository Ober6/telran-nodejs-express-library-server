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
jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");
describe("AccountServiceImplMongo.editAccount", () => {
    const service = new AccountServiceImplMongo();
    test("Failed test: account not found", () => __awaiter(void 0, void 0, void 0, function* () {
        readerMongooseModel.findByIdAndUpdate.mockResolvedValue(null);
        const upd = {
            username: "NewName",
            email: "new@mail.com",
            birthDate: "2000-01-01"
        };
        yield expect(service.editAccount(999, upd))
            .rejects.toThrow("Account not found");
    }));
    test("Passed test", () => __awaiter(void 0, void 0, void 0, function* () {
        const upd = {
            username: "NewName",
            email: "new@mail.com",
            birthDate: "2000-01-01"
        };
        const updated = {
            _id: 123,
            username: "NewName",
            email: "new@mail.com",
            birthDate: "2000-01-01",
            passHash: "hash",
            roles: ["reader"]
        };
        readerMongooseModel.findByIdAndUpdate
            .mockResolvedValue(updated);
        const result = yield service.editAccount(123, upd);
        expect(result.username).toBe("NewName");
        expect(result.email).toBe("new@mail.com");
        expect(readerMongooseModel.findByIdAndUpdate)
            .toHaveBeenCalled();
    }));
    afterEach(() => jest.clearAllMocks());
});
