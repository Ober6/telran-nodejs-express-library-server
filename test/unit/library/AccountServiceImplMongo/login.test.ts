import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.js";
import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
import bcrypt from "bcryptjs";
import {getJWT} from "../../../../src/utils/tools.js";

jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");
jest.mock("bcryptjs");
jest.mock("../../../../src/utils/tools.js");

describe("AccountServiceImplMongo.login", () => {
    const service = new AccountServiceImplMongo();

    const mockReader = {
        _id: 123,
        username: "User",
        email: "mail@mail.com",
        birthDate: "2000-01-01",
        passHash: "hashed_pass",
        roles: ["reader"]
    };

    test("Wrong password", async () => {
        (readerMongooseModel.findById as jest.Mock).mockReturnValue({
            lean: () => ({ exec: () => Promise.resolve(mockReader) })
        });
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

        await expect(service.login(123, "wrong"))
            .rejects.toThrow("Wrong credentials");
    });

    test("Passed test", async () => {
        (readerMongooseModel.findById as jest.Mock).mockReturnValue({
            lean: () => ({ exec: () => Promise.resolve(mockReader) })
        });
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        (getJWT as jest.Mock).mockReturnValue("token123");

        const token = await service.login(123, "pass");

        expect(token).toBe("token123");
    });

    afterEach(() => jest.clearAllMocks());
});
