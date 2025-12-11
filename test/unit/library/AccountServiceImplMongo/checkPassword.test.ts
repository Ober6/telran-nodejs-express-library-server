import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.js";
import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
import bcrypt from "bcryptjs";

jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");
jest.mock("bcryptjs");

describe("AccountServiceImplMongo.checkPassword", () => {
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

        await expect(service.checkPassword(123, "wrong"))
            .rejects.toThrow("Wrong credentials");
    });

    test("Correct password", async () => {
        (readerMongooseModel.findById as jest.Mock).mockReturnValue({
            lean: () => ({ exec: () => Promise.resolve(mockReader) })
        });

        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

        const result = await service.checkPassword(123, "pass");

        expect(result._id).toBe(123);
    });

    afterEach(() => jest.clearAllMocks());
});
