import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.ts";
import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");

describe("AccountServiceImplMongo.getAccount", () => {
    const service = new AccountServiceImplMongo();
    test('Failed test', async () => {
        (readerMongooseModel.findById as jest.Mock).mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null)
            }),
        });
        await expect(service.getAccount(99999))
            .rejects.toThrow('Account not found');
    })

    test('Passed test', async () => {
        const mockAccount = {
            _id: 123,
            username: "MockReader",
            email: "mock@mock.com",
            passHash: "passHash",
            birthDate: "2010-10-10",
            roles: ["reader"]
        };
        (readerMongooseModel.findById as jest.Mock).mockReturnValue({
            lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockAccount)
            })
        })
        const result = await service.getAccount(123);
        expect(readerMongooseModel.findById).toHaveBeenCalledWith(123);
        expect(result._id).toEqual(123);
        expect(result.username).toEqual("MockReader");
    })
    afterEach(() => {
        jest.clearAllMocks();
    })
})