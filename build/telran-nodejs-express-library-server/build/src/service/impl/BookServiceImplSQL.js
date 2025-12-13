export {};
// import {BookService} from "../BookService.js";
// import {Book, BookStatus, PickRecord} from "../../model/book.js";
//
// import {HttpError} from "../../errorHandler/HttpError.js";
// import {pool} from "../../app.js";
// import {RowDataPacket} from "mysql2";
//
// export class BookServiceImplSQL implements BookService {
//     async addBook(book: Book): Promise<void> {
//         const result = await pool.query('INSERT INTO books VALUES(?,?,?,?,?,?)',
//             [book._id, book.title, book.author, book.genre, book.status, book.year])
//         if (!result)
//             throw new HttpError(400, "Can't write book into DB")
//     }
//
//     async getAllBooks(): Promise<Book[]> {
//         const [result] = await pool.query('SELECT * FROM books');
//         console.log(result);
//         return result as Book[];
//     }
//
//     async getBookByAuthor(author: string): Promise<Book[]> {
//         const [result] = await pool.query('SELECT * FROM books WHERE author = ?', [author]);
//         return result as Book[];
//     }
//
//     async pickBook(id: string, reader: string, readerId: number): Promise<void> {
//         let query = "SELECT status FROM books WHERE id = ?";
//         const [books] = await pool.query<RowDataPacket[]>(query, [id]);
//
//         if(books.length === 0) throw new  HttpError(404,`Book with id ${id} not found`);
//         console.log(books)
//         if(books[0].status !== "in_stock") throw new HttpError(409, "Book just on hand!");
//
//         //=========check reader==================
//         query = "SELECT reader_id FROM readers WHERE reader_id = ?";
//         const [readers] = await pool.query<RowDataPacket[]>(query, [readerId]);
//
//         if(readers.length === 0){
//             query = "INSERT INTO readers  VALUES (?,?)";
//             const [newReader] = await pool.query(query, [readerId, reader]);
//         }
//         //==================Create pick record================
//         const now = new Date().toDateString();
//
//         query = `INSERT INTO books_readers (book_id, reader_id, pick_date) VALUES (?, ?, ?)`;
//         await  pool.query(query, [id, readerId, now]);
//
//         //===================Change book status===================
//         query = `UPDATE books SET status = 'on_hand' WHERE id = ?`;
//         await  pool.query(query,[id])
//     }
//
//     async removeBook(id: string): Promise<Book> {
//         //===============check book existing==================
//         let query = "SELECT * FROM books WHERE id = ?";
//         const [books] = await pool.query<RowDataPacket[]>(query, [id]);
//
//         if (books.length === 0) throw new HttpError(404, `Book with id ${id} not found`);
//         if(books[0].status !== "in_stock") throw new HttpError(409, "Book just on hand!");
//         //===================Change book status===================
//         query = `UPDATE books SET status = 'removed' WHERE id = ?`;
//         await  pool.query(query,[id])
//
//         //get records from relation table================
//         const[records] = await pool.query('SELECT * FROM books_readers WHERE book_id = ?', [id]);
//
//         //===========update relation table===============
//         await pool.query('DELETE FROM books_readers WHERE book_id = ?', [id]);
//         //==============delete book======================
//         await pool.query('DELETE FROM books WHERE id = ?', [id])
//
//         const removed:Book = {
//             _id: books[0].id,
//             title: books[0].title,
//             author:books[0].author,
//             status: books[0].status,
//             year: books[0].year,
//             genre:books[0].genre,
//             pickList:records as PickRecord[]};
//
//         return removed;
//     }
//
//     async returnBook(id: string): Promise<void> {
//         let query = "SELECT status FROM books WHERE id = ?";
//         const [books] = await pool.query<RowDataPacket[]>(query, [id]);
//
//         if (books.length === 0) throw new HttpError(404, `Book with id ${id} not found`);
//         console.log(books)
//         if (books[0].status !== "on_hand") throw new HttpError(409, "Wrong book status!");
// //===================Change book status===================
//         query = `UPDATE books SET status = 'in_stock' WHERE id = ?`;
//         await  pool.query(query,[id]);
//         //==========update record========================
//         const now = new Date().toDateString();
//         query = 'UPDATE books_readers SET return_date = ? WHERE book_id = ? AND return_date IS NULL';
//         await  pool.query(query,[now, id]);
//     }
// }
//
// export const bookServiceSql = new BookServiceImplSQL();
