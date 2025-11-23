var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpError } from "../../errorHandler/HttpError.js";
import { pool } from "../../app.js";
export class BookServiceImplSQL {
    addBook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield pool.query('INSERT INTO books VALUES(?,?,?,?,?,?)', [book._id, book.title, book.author, book.genre, book.status, book.year]);
            if (!result)
                throw new HttpError(400, "Can't write book into DB");
        });
    }
    getAllBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const [res] = yield pool.query('SELECT * FROM books');
            if (!res)
                throw new HttpError(400, "Can't get all the books");
            return res;
        });
    }
    getBookByAuthor(author) {
        return __awaiter(this, void 0, void 0, function* () {
            const [res] = yield pool.query('SELECT * FROM books WHERE author = ?', [author]);
            if (!res)
                throw new HttpError(400, "Can't get all the books");
            return res;
        });
    }
    pickBook(id, reader, readerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [books] = yield pool.query('SELECT status FROM books WHERE id = ?', [id]);
            if (!books.length)
                throw new HttpError(404, "Book not found");
            if (books[0].status !== 'in_stock')
                throw new HttpError(400, "Book already taken");
            const [readerRes] = yield pool.query('SELECT id FROM readers WHERE id = ?', [readerId]);
            let readerResId;
            if (readerRes.length)
                readerResId = readerRes[0].id;
            else {
                const [result] = yield pool.query('INSERT INTO readers (name) VALUES (?)', [reader]);
                readerResId = result.insertId;
            }
            yield pool.query('INSERT INTO books_readers (book_id, reader_id) VALUES (?, ?)', [id, readerResId]);
            yield pool.query('UPDATE books SET status = ? WHERE id = ?', ['on_hand', id]);
        });
    }
    removeBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [books] = yield pool.query('SELECT * FROM books WHERE id = ?', [id]);
            if (!books.length)
                throw new HttpError(404, "Book not found");
            const book = books[0];
            yield pool.query('DELETE FROM books_readers WHERE book_id = ?', [id]);
            yield pool.query('DELETE FROM books WHERE id = ?', [id]);
            return book;
        });
    }
    returnBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [books] = yield pool.query('SELECT * FROM books WHERE id = ?', [id]);
            if (!books.length)
                throw new HttpError(404, "Book not found");
            if (books[0].status !== 'on_hand')
                throw new HttpError(400, "Can't return the book");
            yield pool.query('DELETE FROM books_readers WHERE book_id = ?', [id]);
            yield pool.query('UPDATE books SET status = ? WHERE id = ?', ['in_stock', id]);
        });
    }
}
export const bookServiceSql = new BookServiceImplSQL();
