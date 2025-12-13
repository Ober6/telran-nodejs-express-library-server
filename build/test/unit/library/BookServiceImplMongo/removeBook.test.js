var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BookServiceImplMongo } from "../../../../src/service/impl/BookServiceImplMongo.js";
import { BookGenres, BookStatus } from "../../../../src/model/book.js";
import { bookMongooseModel } from "../../../../src/dbSchemas/bookMongooseSchema.js";
jest.mock("../../../../src/dbSchemas/bookMongooseSchema.js");
describe("BookServiceImplMongo.removeBook", () => {
    const service = new BookServiceImplMongo();
    const mockBook = {
        _id: "mock-book-id",
        title: "mockTitle",
        author: "mockAuthor",
        genre: BookGenres.CLASSIC,
        year: 1874,
        status: BookStatus.REMOVED,
        pickList: []
    };
    const mockBookRemoved = {
        _id: "mock-book-id",
        title: "mockTitle",
        author: "mockAuthor",
        genre: BookGenres.CLASSIC,
        year: 1874,
        status: BookStatus.REMOVED,
        pickList: []
    };
    test("Failed test: book not found", () => {
        bookMongooseModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        expect(service.removeBook("UNKNOWN")).rejects.toThrow("Book with id UNKNOWN not exists");
        expect(bookMongooseModel.findById).toHaveBeenCalledWith("UNKNOWN");
    });
    test("Failed test: book status !== IN_STOCK", () => {
        bookMongooseModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                status: BookStatus.ON_HAND,
                save: jest.fn().mockResolvedValue(undefined)
            })
        });
        expect(service.removeBook("WITH_STATUS_ON_HAND")).rejects.toThrow("Book is on hand. Markered as REMOVED");
        expect(bookMongooseModel.findById).toHaveBeenCalledWith("WITH_STATUS_ON_HAND");
    });
    test("Passed test: book in stock", () => __awaiter(void 0, void 0, void 0, function* () {
        const bookDoc = Object.assign(Object.assign({}, mockBook), { status: BookStatus.IN_STOCK });
        bookMongooseModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(bookDoc)
        });
        bookMongooseModel.findByIdAndDelete.mockReturnValue({
            exec: jest.fn().mockResolvedValue(Object.assign(Object.assign({}, mockBook), { status: BookStatus.REMOVED }))
        });
        const result = yield service.removeBook(mockBook._id);
        expect(bookMongooseModel.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);
        expect(result.status).toBe(BookStatus.REMOVED);
    }));
    test("Passed test: book in stock", () => __awaiter(void 0, void 0, void 0, function* () {
        const bookDoc = Object.assign(Object.assign({}, mockBook), { status: BookStatus.IN_STOCK });
        bookMongooseModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(bookDoc)
        });
        bookMongooseModel.findByIdAndDelete.mockReturnValue({
            exec: jest.fn().mockResolvedValue(Object.assign(Object.assign({}, mockBook), { status: BookStatus.REMOVED }))
        });
        const result = yield service.removeBook(mockBook._id);
        expect(bookMongooseModel.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);
        expect(result.status).toBe(BookStatus.REMOVED);
    }));
    afterEach(() => jest.clearAllMocks());
});
