var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BookStatus } from "../../model/book.js";
import { bookMongooseModel } from "../../dbSchemas/bookMongooseSchema.js";
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from "../../errorHandler/HttpError.js";
export class BookServiceImplMongo {
    addBook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            //   const isExists = await bookMongooseModel.findById(book.id)
            // const newBookDoc = await bookMongooseModel.create(book);
            // await newBookDoc.save();
            const doc = yield bookMongooseModel.create(Object.assign(Object.assign({}, book), { _id: uuidv4() }));
        });
    }
    getAllBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bookMongooseModel.find().exec();
            return result;
        });
    }
    getBookByAuthor(author) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield bookMongooseModel.find({ author: author }).exec();
            return result;
        });
    }
    pickBook(id, reader, readerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookDoc = yield bookMongooseModel.findById(id).exec();
            if (!bookDoc)
                throw new HttpError(409, `Book with id ${id} not exists`);
            if (bookDoc.status != BookStatus.IN_STOCK)
                throw new HttpError(409, `Book status is not "in-stock"`);
            bookDoc.status = BookStatus.ON_HAND;
            bookDoc.pickList.push({
                readerId,
                readerName: reader,
                pickDate: new Date().toDateString(),
                returnDate: null
            });
            yield bookDoc.save();
            return Promise.resolve(undefined);
        });
    }
    removeBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookDoc = yield bookMongooseModel.findById(id).exec();
            if (!bookDoc)
                throw new HttpError(409, `Book with id ${id} not exists`);
            if (bookDoc.status !== BookStatus.IN_STOCK) {
                bookDoc.status = BookStatus.REMOVED;
                yield bookDoc.save();
                throw new HttpError(409, "Book is on hand. Markered as REMOVED");
            }
            const removed = yield bookMongooseModel.findByIdAndDelete(id).exec();
            removed.status = BookStatus.REMOVED;
            return removed;
        });
    }
    returnBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookDoc = yield bookMongooseModel.findById(id).exec();
            if (!bookDoc)
                throw new HttpError(409, `Book with id ${id} not exists`);
            if (bookDoc.status === BookStatus.IN_STOCK)
                throw new HttpError(409, `Book is in-stock`);
            bookDoc.pickList[bookDoc.pickList.length - 1].returnDate = new Date().toDateString();
            if (bookDoc.status === BookStatus.REMOVED) {
                bookMongooseModel.findByIdAndDelete(id); //ToDo
                throw new HttpError(400, "Book markered as REMOVED was deleted from DB");
            }
            bookDoc.status = BookStatus.IN_STOCK;
            yield bookDoc.save();
        });
    }
}
export const bookServiceMongo = new BookServiceImplMongo();
