var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { convertBookDtoToBook } from "../utils/tools.js";
// import {bookServiceMongo} from "../service/impl/BookServiceImplMongo.js";
import { bookServiceSql } from "../service/impl/BookServiceImplSQL.js";
export class BookController {
    constructor() {
        // service: BookService = bookServiceEmbedded;
        //private service: BookService = bookServiceMongo;
        this.service = bookServiceSql;
        this.removeBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bookId = req.query.bookId;
            const result = yield this.service.removeBook(bookId);
            res.json(result);
        });
        this.addBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dto = req.body;
            const book = convertBookDtoToBook(dto);
            const result = yield this.service.addBook(book);
            res.status(201).json(result);
        });
        this.getAllBooks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.service.getAllBooks();
            res.json(result);
        });
        this.pickBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bookId = req.query.bookId;
            const { readerName, readerId } = req.body;
            yield this.service.pickBook(bookId, readerName, +readerId);
            res.send(`Book picked to ${readerName}`);
        });
        this.returnBook = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bookId = req.query.bookId;
            yield this.service.returnBook(bookId);
            res.send("Book returned");
        });
        this.getBookByAuthor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const author = req.query.author;
            const result = yield this.service.getBookByAuthor(author);
            res.json(result);
        });
    }
}
export const bookController = new BookController();
