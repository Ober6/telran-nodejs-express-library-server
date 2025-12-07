import {BookService} from "../service/BookService.js";
// import {bookServiceEmbedded} from "../service/impl/BookServiceImplEmbedded.js";
import {NextFunction, Request, Response} from "express";
import {Book, BookDto} from "../model/book.js";
import {convertBookDtoToBook} from "../utils/tools.js";
 import {bookServiceMongo} from "../service/impl/BookServiceImplMongo.js";
// import {bookServiceSql} from "../service/impl/BookServiceImplSQL.js";
import  {AuthRequest} from "../utils/libTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {accountServiceMongo} from "../service/impl/AccountServiceImplMongo.js";

export class BookController {
    //private service: BookService = bookServiceEmbedded;
    private service: BookService = bookServiceMongo;
    //private service: BookService = bookServiceSql;

    removeBook = async (req:Request, res:Response) => {
        const bookId = req.query.bookId;
        const result = await this.service.removeBook(bookId as string);
        res.json(result)
    }

    addBook = async (req:Request, res:Response) =>  {
        const dto = req.body as BookDto;
        const book:Book = convertBookDtoToBook(dto);
        const result = await this.service.addBook(book);
        res.status(201).json(result)
    }
    getAllBooks = async (req:Request, res: Response)=> {
        const result = await this.service.getAllBooks();
        res.json(result)
    }
    pickBook = async (req:AuthRequest, res: Response) => {
        const bookId = req.query.bookId;
        const readerId = req.query.readerId;
        if(!readerId)
            throw new HttpError(401, "");
        const {username} = await accountServiceMongo.getAccount(+readerId)
        await this.service.pickBook(bookId as string, username, +readerId);
        res.send(`Book picked to ${username}`);
    }
    returnBook = async (req:Request, res: Response) => {
        const bookId = req.query.bookId;
        await this.service.returnBook(bookId as string);
        res.send("Book returned")
    }
    getBookByAuthor = async (req:Request, res: Response) => {
        const author = req.query.author;
        const result = await this.service.getBookByAuthor(author as string);
        res.json(result);
    }
}


export const bookController = new BookController();