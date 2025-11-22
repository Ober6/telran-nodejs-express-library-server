import {BookService} from "../BookService.js";
import {Book} from "../../model/book.js";

import {HttpError} from "../../errorHandler/HttpError.js";
import {pool} from "../../app.js";

export class BookServiceImplSQL implements BookService{
    async addBook(book: Book): Promise<void> {
        const result = await pool.query('INSERT INTO books VALUES(?,?,?,?,?,?)',
            [book._id, book.title, book.author, book.genre, book.status, book.year])
        if(!result)
            throw new HttpError(400, "Can't write book into DB")
    }

    getAllBooks(): Promise<Book[]> {
        return Promise.resolve([]);
    }

    getBookByAuthor(author: string): Promise<Book[]> {
        return Promise.resolve([]);
    }

    pickBook(id: string, reader: string, readerId: number): Promise<void> {
        return Promise.resolve(undefined);
    }

    removeBook(id: string): Promise<Book> {
        throw ""
    }

    returnBook(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }

}

export const bookServiceSql = new BookServiceImplSQL();