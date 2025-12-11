import {BookServiceImplMongo} from "../../../../src/service/impl/BookServiceImplMongo.js";
import {Book, BookGenres, BookStatus, PickRecord} from "../../../../src/model/book.js";
import {bookMongooseModel} from "../../../../src/dbSchemas/bookMongooseSchema.js";
jest.mock("../../../../src/dbSchemas/bookMongooseSchema.js");

describe("BookServiceImplMongo.removeBook", () => {
    const service = new BookServiceImplMongo();

    const mockBook:Book = {
        _id:"mock-book-id",
        title:"mockTitle",
        author:"mockAuthor",
        genre:BookGenres.CLASSIC,
        year:1874,
        status: BookStatus.REMOVED,
        pickList: []
    }

    test("Failed test: book not found", () => {
        (bookMongooseModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });
        expect(service.removeBook("UNKNOWN")).rejects.toThrow("Book with id UNKNOWN not exists");
        expect(bookMongooseModel.findById).toHaveBeenCalledWith("UNKNOWN");
    })
    test("Failed test: book status !== IN_STOCK", () => {
        (bookMongooseModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                status: BookStatus.ON_HAND,
                save: jest.fn().mockResolvedValue(undefined)
            })
        });
        expect(service.removeBook("WITH_STATUS_ON_HAND")).rejects.toThrow("Book is on hand. Markered as REMOVED")
        expect(bookMongooseModel.findById).toHaveBeenCalledWith("WITH_STATUS_ON_HAND")
    })
})