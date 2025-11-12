import {BookService} from "../service/BookService.js";
import {bookServiceEmbedded} from "../service/BookServiceImplEmbedded.js";
import {Request, Response, NextFunction} from "express";
import {Book, BookDto} from "../model/book.js";
import {convertBookDtoToBook} from "../utils/tools.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {bookDtoSchema, pickBookSchema} from "../joiSchemas/bookSchemas.js";

export class BookController {
    constructor(private bookService: BookService) {}

    async addBook(req: Request, res: Response, next: NextFunction) {
        const body = req.body;
        const {error} = bookDtoSchema.validate(body);
        if (error) {
            throw new HttpError(400, error.message);
        }
        const book: Book = convertBookDtoToBook(body as BookDto);
        await this.bookService.addBook(book);
        res.status(201).json(book);
    }

    async getAllBooks(req: Request, res: Response, next: NextFunction) {
        const result = await this.bookService.getAllBooks();
        res.status(200).json(result);
    }

    async getBookByAuthor(req: Request, res: Response, next: NextFunction) {
        const {author} = req.params;
        if (!author) {
            throw new HttpError(400, "Author parameter is required");
        }
        const result = await this.bookService.getBookByAuthor(author);
        res.status(200).json(result);
    }

    async removeBook(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;
        if (!id) {
            throw new HttpError(400, "Book ID is required");
        }
        const result = await this.bookService.removeBook(id);
        res.status(200).json(result);
    }

    async pickBook(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;
        const body = req.body;

        if (!id) {
            throw new HttpError(400, "Book ID is required");
        }

        const {error} = pickBookSchema.validate(body);
        if (error) {
            throw new HttpError(400, error.message);
        }

        const {reader, readerId} = body;
        await this.bookService.pickBook(id, reader, readerId);
        res.status(200).json({message: "Book picked successfully"});
    }

    async returnBook(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;
        if (!id) {
            throw new HttpError(400, "Book ID is required");
        }
        await this.bookService.returnBook(id);
        res.status(200).json({message: "Book returned successfully"});
    }
}

export const bookController = new BookController(bookServiceEmbedded);