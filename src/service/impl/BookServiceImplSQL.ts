import {BookService} from "../BookService.js";
import {Book, BookStatus} from "../../model/book.js";

import {HttpError} from "../../errorHandler/HttpError.js";
import {pool} from "../../app.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export class BookServiceImplSQL implements BookService {
    async addBook(book: Book): Promise<void> {
        const result = await pool.query('INSERT INTO books VALUES(?,?,?,?,?,?)',
            [book._id, book.title, book.author, book.genre, book.status, book.year])
        if (!result)
            throw new HttpError(400, "Can't write book into DB")
    }

    async getAllBooks(): Promise<Book[]> {
        const [res] = await pool.query<RowDataPacket[]>('SELECT * FROM books');
        if (!res)
            throw new HttpError(400, "Can't get all the books");
        return res as Book[];
    }

    async getBookByAuthor(author: string): Promise<Book[]> {
        const [res] = await pool.query<RowDataPacket[]>('SELECT * FROM books WHERE author = ?', [author]);
        if (!res)
            throw new HttpError(400, "Can't get all the books");
        return res as Book[];
    }

    async pickBook(id: string, reader: string, readerId: number): Promise<void> {
        const [books] = await pool.query<RowDataPacket[]>('SELECT status FROM books WHERE id = ?', [id]);
        if (!books.length) throw new HttpError(404, "Book not found");
        if (books[0].status !== 'in_stock') throw new HttpError(400, "Book already taken");

        const [readerRes] = await pool.query<RowDataPacket[]>('SELECT id FROM readers WHERE id = ?', [readerId]);

        let readerResId: number;
        if(readerRes.length) readerResId = readerRes[0].id;

        else{
            const [result] = await pool.query<ResultSetHeader>('INSERT INTO readers (name) VALUES (?)', [reader]);
            readerResId = result.insertId;
        }

        await pool.query( 'INSERT INTO books_readers (book_id, reader_id) VALUES (?, ?)', [id, readerResId]);

        await pool.query('UPDATE books SET status = ? WHERE id = ?', ['on_hand', id]);
    }

    async removeBook(id: string): Promise<Book> {
        const [books] = await pool.query<RowDataPacket[]>('SELECT * FROM books WHERE id = ?', [id]);

        if(!books.length) throw new HttpError(404, "Book not found");

        const book = books[0] as Book;

        await pool.query('DELETE FROM books_readers WHERE book_id = ?', [id]);

        await pool.query('DELETE FROM books WHERE id = ?', [id]);

        return book;
    }

    async returnBook(id: string): Promise<void> {
        const [books] = await pool.query<RowDataPacket[]>('SELECT * FROM books WHERE id = ?', [id]);

        if(!books.length) throw new HttpError(404, "Book not found");

        if(books[0].status !== 'on_hand') throw new HttpError(400, "Can't return the book");

        await pool.query('DELETE FROM books_readers WHERE book_id = ?', [id]);

        await pool.query('UPDATE books SET status = ? WHERE id = ?', ['in_stock', id]);
    }

}

export const bookServiceSql = new BookServiceImplSQL();