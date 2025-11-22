import {BookService} from "../BookService.js";
import {Book, BookStatus} from "../../model/book.js";
import {bookMongooseModel} from "../../dbSchemas/bookMongooseSchema.js";
import { v4 as uuidv4 } from 'uuid';
import {HttpError} from "../../errorHandler/HttpError.js";
import {bookRouter} from "../../routers/bookRouter.js";

export class BookServiceImplMongo implements BookService{

    async addBook(book: Book): Promise<void> {
        //   const isExists = await bookMongooseModel.findById(book.id)
        // const newBookDoc = await bookMongooseModel.create(book);
        // await newBookDoc.save();
        const doc = await  bookMongooseModel.create({...book,
            _id: uuidv4()});
    }

    async getAllBooks(): Promise<Book[]> {
        const result = await bookMongooseModel.find().exec() as Book[];
        return result;
    }

    async getBookByAuthor(author: string): Promise<Book[]> {
        const result =  await bookMongooseModel.find({author:author}).exec() as Book[]
        return result;
    }

    async pickBook(id: string, reader: string, readerId: number): Promise<void> {
        const bookDoc = await bookMongooseModel.findById(id).exec();
        if(!bookDoc) throw new HttpError(409, `Book with id ${id} not exists`);
        if(bookDoc.status != BookStatus.IN_STOCK)
            throw new HttpError(409, `Book status is not "in-stock"`);
        bookDoc.status = BookStatus.ON_HAND;
        bookDoc.pickList.push({
            readerId,
            readerName:reader,
            pickDate: new Date().toDateString(),
            returnDate: null
        })
        await bookDoc.save();
        return Promise.resolve(undefined);
    }

    async removeBook(id: string): Promise<Book> {
        const bookDoc = await bookMongooseModel.findById(id).exec();
        if(!bookDoc) throw new HttpError(409, `Book with id ${id} not exists`);

        if(bookDoc.status !== BookStatus.IN_STOCK) {
            bookDoc.status = BookStatus.REMOVED;
            await bookDoc.save()
            throw new HttpError(409, "Book is on hand. Markered as REMOVED")
        }
        const removed = await bookMongooseModel.findByIdAndDelete(id).exec() as Book;

        return removed;
    }

    async returnBook(id: string): Promise<void> {
        const bookDoc = await bookMongooseModel.findById(id).exec();
        if (!bookDoc) throw new HttpError(409, `Book with id ${id} not exists`);
        if(bookDoc.status === BookStatus.IN_STOCK) throw new HttpError(409, `Book is in-stock`);
        bookDoc.pickList[bookDoc.pickList.length -1].returnDate = new Date().toDateString();
        if(bookDoc.status === BookStatus.REMOVED){
            bookMongooseModel.findByIdAndDelete(id); //ToDo
            throw new HttpError(400, "Book markered as REMOVED was deleted from DB")
        }

        bookDoc.status = BookStatus.IN_STOCK
        await bookDoc.save();
    }

}

export const bookServiceMongo = new BookServiceImplMongo();