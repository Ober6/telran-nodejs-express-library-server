var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AccountServiceImplMongo } from "../../../src/service/impl/AccountServiceImplMongo.js";
describe("AccountServiceImplMongo", () => {
    const service = new AccountServiceImplMongo();
    test('Failed test', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(service.getAccount(99999)).rejects.toThrow("Account not found");
    }));
});
