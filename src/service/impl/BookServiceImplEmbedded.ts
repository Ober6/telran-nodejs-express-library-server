import {BookService} from "../BookService.js";
import {Book, BookGenres, BookStatus, PickRecord} from "../../model/book.js";
import {HttpError} from "../../errorHandler/HttpError.js";

class BookServiceImplEmbedded implements BookService{
    private books:Book[] = [
        {
            _id:"123",
            title:"War And Peace",
            author:"Lev Tolstoy",
            genre:BookGenres.CLASSIC,
            year:2000,
            status: BookStatus.IN_STOCK,
            pickList: []
        }
    ];

    addBook(book: Book): Promise<void> {
        if(this.books.find(item => item._id === book._id))
            throw new HttpError(409, `Book with id: ${book._id} already exists`)
        this.books.push(book);
        return Promise.resolve();
    }

    getAllBooks(): Promise<Book[]> {
        return Promise.resolve([...this.books]);
    }

    getBookByAuthor(author: string): Promise<Book[]> {
        return Promise.resolve(this.books.filter(item => item.author === author));
    }

    pickBook(id: string, reader: string, readerId: number): Promise<void> {
        const book = this.books.find(item => item._id === id);
        if(!book) throw new HttpError(404, `Book with id ${id} not found` );
        if(book.status !== BookStatus.IN_STOCK) throw new  HttpError(409, "Book just picked")
        book.status = BookStatus.ON_HAND;
        book.pickList.push({readerId, readerName:reader, pickDate:new Date().toDateString(),returnDate:null})
        return Promise.resolve();
    }

    removeBook(id: string): Promise<Book> {
        const index = this.books.findIndex(item => item._id === id);
        if(index === -1) throw  new HttpError(404, `Book with id ${id} not found`)
        const removed = this.books.splice(index, 1)[0];
        removed.status = BookStatus.REMOVED;
        return Promise.resolve(removed);
    }

    returnBook(id: string): Promise<void> {
        const book = this.books.find(item => item._id === id);
        if(!book) throw new HttpError(404, `Book with id ${id} not found` );
        if(book.status !== BookStatus.ON_HAND) throw new  HttpError(409, "Book in stock")
        book.status = BookStatus.IN_STOCK;
        book.pickList[book.pickList.length -1].returnDate = new Date().toDateString();
        return Promise.resolve();
    }

}

export  const bookServiceEmbedded = new BookServiceImplEmbedded();