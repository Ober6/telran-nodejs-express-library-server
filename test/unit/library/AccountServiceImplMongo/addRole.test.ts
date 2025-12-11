import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.js";
import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
import {Roles} from "../../../../src/utils/libTypes.js";

jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");

describe("AccountServiceImplMongo.addRole", () => {
    const service = new AccountServiceImplMongo();

    test("Failed test: account not found", async () => {
        (readerMongooseModel.findById as jest.Mock).mockResolvedValue(null);

        await expect(service.addRole(123, Roles.ADMIN))
            .rejects.toThrow("");
    });

    test("Role already exists", async () => {
        const mockAccount = {
            roles: [Roles.ADMIN],
            save: jest.fn()
        };

        (readerMongooseModel.findById as jest.Mock).mockResolvedValue(mockAccount);

        await expect(service.addRole(123, Roles.ADMIN))
            .rejects.toThrow("Role 'admin' already exists");
    });

    test("Passed test", async () => {
        const mockAccount = {
            roles: [],
            save: jest.fn().mockResolvedValue(undefined)
        };

        (readerMongooseModel.findById as jest.Mock).mockResolvedValue(mockAccount);

        const result = await service.addRole(123, Roles.ADMIN);

        expect(mockAccount.roles).toContain(Roles.ADMIN);
        expect(result.roles).toContain(Roles.ADMIN);
    });

    afterEach(() => jest.clearAllMocks());
});
