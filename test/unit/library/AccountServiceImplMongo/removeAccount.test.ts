import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.js";
import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");

describe("AccountServiceImplMongo.removeAccount", () => {
    const service = new AccountServiceImplMongo();

    test("Failed test: account not found", async () => {
        (readerMongooseModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await expect(service.removeAccount(10))
            .rejects.toThrow("Account not found");
        expect(readerMongooseModel.findByIdAndDelete).toHaveBeenCalledWith(10);
    });

    test("Passed test", async () => {
        const mockDeleted = {
            _id: 10,
            username: "name123",
            email: "email123",
            passHash: "hash123",
            birthDate: "2020-04-01",
            roles: []
        };

        (readerMongooseModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeleted);

        const result = await service.removeAccount(10);

        expect(result._id).toBe(10);
        expect(result.username).toBe("name123");
    });

    afterEach(() => jest.clearAllMocks());
});
