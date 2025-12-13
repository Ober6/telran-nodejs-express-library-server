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
import { Roles } from "../../../../src/utils/libTypes.js";
jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");
describe("AccountServiceImplMongo.addRole", () => {
    const service = new AccountServiceImplMongo();
    test("Failed test: account not found", () => __awaiter(void 0, void 0, void 0, function* () {
        readerMongooseModel.findById.mockResolvedValue(null);
        yield expect(service.addRole(123, Roles.ADMIN))
            .rejects.toThrow("");
    }));
    test("Role already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAccount = {
            roles: [Roles.ADMIN],
            save: jest.fn()
        };
        readerMongooseModel.findById.mockResolvedValue(mockAccount);
        yield expect(service.addRole(123, Roles.ADMIN))
            .rejects.toThrow("Role 'admin' already exists");
    }));
    test("Passed test", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockAccount = {
            roles: [],
            save: jest.fn()
        };
        mockAccount.save.mockResolvedValue(mockAccount);
        readerMongooseModel.findById.mockResolvedValue(mockAccount);
        const result = yield service.addRole(123, Roles.ADMIN);
        expect(mockAccount.roles).toContain(Roles.ADMIN);
        expect(result.roles).toContain(Roles.ADMIN);
    }));
    afterEach(() => jest.clearAllMocks());
});
