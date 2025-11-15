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
import { BookModel } from "../../dbSchemas/bookMongooseSchema.js";
import { HttpError } from "../../errorHandler/HttpError.js";
import { mapDocToBook } from "../../utils/tools.js";
class BookServiceImplMongo {
    addBook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            yield BookModel.create({
                title: book.title,
                author: book.author,
                genre: book.genre,
                year: book.year,
                status: book.status || BookStatus.IN_STOCK,
                pickList: book.pickList || []
            });
        });
    }
    getAllBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield BookModel.find();
            return docs.map(doc => mapDocToBook(doc));
        });
    }
    getBookByAuthor(author) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield BookModel.find({
                author: { $regex: new RegExp(`^${author}$`, "i") }
            });
            return docs.map(doc => mapDocToBook(doc));
        });
    }
    pickBook(id, reader, readerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield BookModel.findById(id);
            if (!doc)
                throw new HttpError(404, `Book with id: ${id} not found`);
            if (doc.status !== BookStatus.IN_STOCK)
                throw new HttpError(400, `Book is not available. Current status: ${doc.status}`);
            doc.pickList.push({
                readerId,
                readerName: reader,
                pickDate: new Date().toISOString(),
                returnDate: null
            });
            doc.status = BookStatus.ON_HAND;
            yield doc.save();
        });
    }
    removeBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield BookModel.findById(id);
            if (!doc)
                throw new HttpError(404, `Book with id: ${id} not found`);
            if (doc.status === BookStatus.ON_HAND)
                throw new HttpError(400, `Cannot remove book that is currently on hand`);
            doc.status = BookStatus.REMOVED;
            yield doc.save();
            yield BookModel.deleteOne({ _id: id });
            return mapDocToBook(doc);
        });
    }
    returnBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield BookModel.findById(id);
            if (!doc)
                throw new HttpError(404, `Book with id: ${id} not found`);
            if (doc.status !== BookStatus.ON_HAND)
                throw new HttpError(400, `Book is not on hand. Current status: ${doc.status}`);
            const activeRecord = [...doc.pickList]
                .reverse()
                .find(r => r.returnDate === null);
            if (activeRecord)
                activeRecord.returnDate = new Date().toISOString();
            doc.status = BookStatus.IN_STOCK;
            yield doc.save();
        });
    }
}
export const booksServiceMongo = new BookServiceImplMongo();
