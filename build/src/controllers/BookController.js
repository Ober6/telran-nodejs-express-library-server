var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import {bookServiceEmbedded} from "../service/impl/BookServiceImplEmbedded.js";
import { booksServiceMongo } from "../service/impl/BookServiceImplMongo.js";
import { convertBookDtoToBook } from "../utils/tools.js";
import { HttpError } from "../errorHandler/HttpError.js";
import { bookDtoSchema, pickBookSchema } from "../joiSchemas/bookJoiSchemas.js";
export class BookController {
    constructor(bookService) {
        this.bookService = bookService;
    }
    addBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { error } = bookDtoSchema.validate(body);
            if (error) {
                throw new HttpError(400, error.message);
            }
            const book = convertBookDtoToBook(body);
            yield this.bookService.addBook(book);
            res.status(201).json(book);
        });
    }
    getAllBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bookService.getAllBooks();
            res.status(200).json(result);
        });
    }
    getBookByAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { author } = req.params;
            if (!author) {
                throw new HttpError(400, "Author parameter is required");
            }
            const result = yield this.bookService.getBookByAuthor(author);
            res.status(200).json(result);
        });
    }
    removeBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                throw new HttpError(400, "Book ID is required");
            }
            const result = yield this.bookService.removeBook(id);
            res.status(200).json(result);
        });
    }
    pickBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const body = req.body;
            if (!id) {
                throw new HttpError(400, "Book ID is required");
            }
            const { error } = pickBookSchema.validate(body);
            if (error) {
                throw new HttpError(400, error.message);
            }
            const { reader, readerId } = body;
            yield this.bookService.pickBook(id, reader, readerId);
            res.status(200).json({ message: "Book picked successfully" });
        });
    }
    returnBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                throw new HttpError(400, "Book ID is required");
            }
            yield this.bookService.returnBook(id);
            res.status(200).json({ message: "Book returned successfully" });
        });
    }
}
// export const bookController = new BookController(bookServiceEmbedded);
export const bookController = new BookController(booksServiceMongo);
