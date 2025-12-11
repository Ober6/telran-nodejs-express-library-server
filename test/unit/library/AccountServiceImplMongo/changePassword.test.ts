import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.js";
import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
import bcrypt from "bcryptjs";

jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");
jest.mock("bcryptjs");

describe("AccountServiceImplMongo.changePassword", () => {
    const service = new AccountServiceImplMongo();

    test("Failed test: account not found", async () => {
        (readerMongooseModel.findById as jest.Mock).mockResolvedValue(null);

        await expect(service.changePassword(123, "newPass"))
            .rejects.toThrow("Account not found");
    });

    test("Passed test", async () => {
        const mockAccount = {
            passHash: "",
            save: jest.fn().mockResolvedValue(undefined)
        };

        (readerMongooseModel.findById as jest.Mock).mockResolvedValue(mockAccount);
        (bcrypt.hashSync as jest.Mock).mockReturnValue("hashed_pass");

        await expect(service.changePassword(123, "newPass"))
            .resolves.toBeUndefined();

        expect(mockAccount.passHash).toBe("hashed_pass");
        expect(mockAccount.save).toHaveBeenCalled();
    });

    afterEach(() => jest.clearAllMocks());
});
