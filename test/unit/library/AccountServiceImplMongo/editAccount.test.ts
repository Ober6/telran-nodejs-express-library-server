import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.js";
import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
import {UpdateReaderDto} from "../../../../src/model/reader.js";

jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");

describe("AccountServiceImplMongo.editAccount", () => {
    const service = new AccountServiceImplMongo();

    test("Failed test: account not found", async () => {
        (readerMongooseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

        const upd: UpdateReaderDto = {
            username: "NewName",
            email: "new@mail.com",
            birthDate: "2000-01-01"
        };

        await expect(service.editAccount(999, upd))
            .rejects.toThrow("Account not found");
    });

    test("Passed test", async () => {
        const upd: UpdateReaderDto = {
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

        (readerMongooseModel.findByIdAndUpdate as jest.Mock)
            .mockResolvedValue(updated);

        const result = await service.editAccount(123, upd);

        expect(result.username).toBe("NewName");
        expect(result.email).toBe("new@mail.com");
        expect(readerMongooseModel.findByIdAndUpdate)
            .toHaveBeenCalled();
    });

    afterEach(() => jest.clearAllMocks());
});
