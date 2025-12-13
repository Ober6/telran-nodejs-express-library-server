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
describe("AccountServiceImplMongo.getAccount", () => {
    const service = new AccountServiceImplMongo();
    test('Failed test', () => __awaiter(void 0, void 0, void 0, function* () {
        readerMongooseModel.findById.mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            }),
        });
        yield expect(service.getAccount(99999))
            .rejects.toThrow('Account not found');
    }));
    test('Passed test', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAccount = {
            _id: 123,
            username: "MockReader",
            email: "mock@mock.com",
            passHash: "passHash",
            birthDate: "2010-10-10",
            roles: ["reader"]
        };
        readerMongooseModel.findById.mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockAccount)
            })
        });
        const result = yield service.getAccount(123);
        expect(readerMongooseModel.findById).toHaveBeenCalledWith(123);
        expect(result._id).toEqual(123);
        expect(result.username).toEqual("MockReader");
    }));
    afterEach(() => {
        jest.clearAllMocks();
    });
});
