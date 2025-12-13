import { readerMongooseModel } from "../../../../src/dbSchemas/readerMongooseSchema.js";
import { AccountServiceImplMongo } from "../../../../src/service/impl/AccountServiceImplMongo.js";
jest.mock("../../../../src/dbSchemas/readerMongooseSchema.js");
describe('AccountServiceImplMongo.createAccount', () => {
    const service = new AccountServiceImplMongo();
    const mockReader = {
        _id: 123
    };
    test("Failed test: reader already exists", () => {
        readerMongooseModel.findById.mockResolvedValue(mockReader);
        expect(service.createAccount(mockReader)).rejects.toThrow("Reader already exists");
        expect(readerMongooseModel.findById).toHaveBeenCalledWith(mockReader._id);
    });
    test("Passed test", () => {
        readerMongooseModel.findById.mockResolvedValue(null);
        readerMongooseModel.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(undefined)
        }));
        expect(service.createAccount(mockReader)).resolves.toBeUndefined();
        expect(readerMongooseModel.findById).toHaveBeenCalledWith(mockReader._id);
    });
});
