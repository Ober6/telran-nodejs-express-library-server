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
            const [result] = yield pool.query('SELECT * FROM books');
            console.log(result);
            return result;
        });
    }
    getBookByAuthor(author) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield pool.query('SELECT * FROM books WHERE author = ?', [author]);
            return result;
        });
    }
    pickBook(id, reader, readerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT status FROM books WHERE id = ?";
            const [books] = yield pool.query(query, [id]);
            if (books.length === 0)
                throw new HttpError(404, `Book with id ${id} not found`);
            console.log(books);
            if (books[0].status !== "in_stock")
                throw new HttpError(409, "Book just on hand!");
            //=========check reader==================
            query = "SELECT reader_id FROM readers WHERE reader_id = ?";
            const [readers] = yield pool.query(query, [readerId]);
            if (readers.length === 0) {
                query = "INSERT INTO readers  VALUES (?,?)";
                const [newReader] = yield pool.query(query, [readerId, reader]);
            }
            //==================Create pick record================
            const now = new Date().toDateString();
            query = `INSERT INTO books_readers (book_id, reader_id, pick_date) VALUES (?, ?, ?)`;
            yield pool.query(query, [id, readerId, now]);
            //===================Change book status===================
            query = `UPDATE books SET status = 'on_hand' WHERE id = ?`;
            yield pool.query(query, [id]);
        });
    }
    removeBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //===============check book existing==================
            let query = "SELECT * FROM books WHERE id = ?";
            const [books] = yield pool.query(query, [id]);
            if (books.length === 0)
                throw new HttpError(404, `Book with id ${id} not found`);
            if (books[0].status !== "in_stock")
                throw new HttpError(409, "Book just on hand!");
            //===================Change book status===================
            query = `UPDATE books SET status = 'removed' WHERE id = ?`;
            yield pool.query(query, [id]);
            //get records from relation table================
            const [records] = yield pool.query('SELECT * FROM books_readers WHERE book_id = ?', [id]);
            //===========update relation table===============
            yield pool.query('DELETE FROM books_readers WHERE book_id = ?', [id]);
            //==============delete book======================
            yield pool.query('DELETE FROM books WHERE id = ?', [id]);
            const removed = {
                _id: books[0].id,
                title: books[0].title,
                author: books[0].author,
                status: books[0].status,
                year: books[0].year,
                genre: books[0].genre,
                pickList: records
            };
            return removed;
        });
    }
    returnBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "SELECT status FROM books WHERE id = ?";
            const [books] = yield pool.query(query, [id]);
            if (books.length === 0)
                throw new HttpError(404, `Book with id ${id} not found`);
            console.log(books);
            if (books[0].status !== "on_hand")
                throw new HttpError(409, "Wrong book status!");
            //===================Change book status===================
            query = `UPDATE books SET status = 'in_stock' WHERE id = ?`;
            yield pool.query(query, [id]);
            //==========update record========================
            const now = new Date().toDateString();
            query = 'UPDATE books_readers SET return_date = ? WHERE book_id = ? AND return_date IS NULL';
            yield pool.query(query, [now, id]);
        });
    }
}
export const bookServiceSql = new BookServiceImplSQL();
