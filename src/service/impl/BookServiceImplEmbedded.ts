import {BookService} from "../BookService.js";
import {Book, BookStatus} from "../../model/book.js";
import {HttpError} from "../../errorHandler/HttpError.js";

class BookServiceImplEmbedded implements BookService{
    private books:Book[] = [];

    addBook(book: Book): Promise<void> {
        if(this.books.find(item => item.id === book.id))
            throw new HttpError(409, `Book with id: ${book.id} already exists`)
        this.books.push(book);
        return Promise.resolve();
    }

    getAllBooks(): Promise<Book[]> {
        return Promise.resolve([...this.books]);
    }

    getBookByAuthor(author: string): Promise<Book[]> {
        const booksByAuthor = this.books.filter(
            book => book.author.toLowerCase() === author.toLowerCase()
        );
        return Promise.resolve(booksByAuthor);
    }

    pickBook(id: string, reader: string, readerId: number): Promise<void> {
        const book = this.books.find(item => item.id === id);

        if (!book) {
            throw new HttpError(404, `Book with id: ${id} not found`);
        }

        if (book.status !== BookStatus.IN_STOCK) {
            throw new HttpError(400, `Book is not available. Current status: ${book.status}`);
        }

        book.pickList.push({
            readerId,
            readerName: reader,
            pickDate: new Date().toISOString(),
            returnDate: null
        });

        book.status = BookStatus.ON_HAND;
        return Promise.resolve();
    }

    removeBook(id: string): Promise<Book> {
        const bookIndex = this.books.findIndex(item => item.id === id);

        if (bookIndex === -1) {
            throw new HttpError(404, `Book with id: ${id} not found`);
        }

        const book = this.books[bookIndex];

        if (book.status === BookStatus.ON_HAND) {
            throw new HttpError(400, `Cannot remove book that is currently on hand`);
        }

        book.status = BookStatus.REMOVED;
        this.books.splice(bookIndex, 1);

        return Promise.resolve(book);
    }

    returnBook(id: string): Promise<void> {
        const book = this.books.find(item => item.id === id);

        if (!book) {
            throw new HttpError(404, `Book with id: ${id} not found`);
        }

        if (book.status !== BookStatus.ON_HAND) {
            throw new HttpError(400, `Book is not on hand. Current status: ${book.status}`);
        }

        const activePickRecord = book.pickList
            .slice()
            .reverse()
            .find(record => record.returnDate === null);

        if (activePickRecord) {
            activePickRecord.returnDate = new Date().toISOString();
        }

        book.status = BookStatus.IN_STOCK;
        return Promise.resolve();
    }

}

export  const bookServiceEmbedded = new BookServiceImplEmbedded();