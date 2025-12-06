import {AccountServiceImplMongo} from "../../../src/service/impl/AccountServiceImplMongo.js";

describe("AccountServiceImplMongo", () => {
    const service = new AccountServiceImplMongo();
    test('Failed test', async () => {
        await expect(service.getAccount(99999)).rejects.toThrow("Account not found");
    })
})