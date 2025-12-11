import {readerMongooseModel} from "../../../../src/dbSchemas/readerMongooseSchema.js";
import {AccountServiceImplMongo} from "../../../../src/service/impl/AccountServiceImplMongo.js";
import {Reader} from "../../../../src/model/reader.js";
jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");

describe('AccountServiceImplMongo.createAccount', () => {
    const service = new AccountServiceImplMongo();
    const mockReader = {
        _id:123
    }
    test("Failed test: reader already exists", () => {
        (readerMongooseModel.findById as jest.Mock).mockResolvedValue(mockReader);
        expect(service.createAccount(mockReader as Reader)).rejects.toThrow("Reader already exists")
        expect(readerMongooseModel.findById).toHaveBeenCalledWith(mockReader._id);
    })
    test("Passed test", () => {
        (readerMongooseModel.findById as jest.Mock).mockResolvedValue(null);
        (readerMongooseModel as unknown as jest.Mock).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(undefined)
        }))
        expect(service.createAccount(mockReader as Reader)).resolves.toBeUndefined()
        expect(readerMongooseModel.findById).toHaveBeenCalledWith(mockReader._id);
    })
})