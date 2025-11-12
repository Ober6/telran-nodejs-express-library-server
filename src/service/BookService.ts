import {Book, BookDto} from "../model/book.js";

export interface BookService {
    addBook: (book: Book) => Promise<void>;
    removeBook: (id: string) => Promise<Book>;
    pickBook: (id:string, reader: string, readerId: number) => Promise<void>
    returnBook: (id:string) => Promise<void>
    getAllBooks: () => Promise<Book[]>
    getBookByAuthor: (author:string) => Promise<Book[]>
}