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
describe("AccountServiceImplMongo.removeAccount", () => {
    const service = new AccountServiceImplMongo();
    test("Failed test: account not found", () => __awaiter(void 0, void 0, void 0, function* () {
        readerMongooseModel.findByIdAndDelete.mockResolvedValue(null);
        yield expect(service.removeAccount(10))
            .rejects.toThrow("Account not found");
        expect(readerMongooseModel.findByIdAndDelete).toHaveBeenCalledWith(10);
    }));
    test("Passed test", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockDeleted = {
            _id: 10,
            username: "name123",
            email: "email123",
            passHash: "hash123",
            birthDate: "2020-04-01",
            roles: []
        };
        readerMongooseModel.findByIdAndDelete.mockResolvedValue(mockDeleted);
        const result = yield service.removeAccount(10);
        expect(result._id).toBe(10);
        expect(result.username).toBe("name123");
    }));
    afterEach(() => jest.clearAllMocks());
});
