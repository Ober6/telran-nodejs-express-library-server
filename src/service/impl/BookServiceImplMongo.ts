import { BookService } from "../BookService.js";
import { Book, BookStatus } from "../../model/book.js";
import { BookModel } from "../../dbSchemas/bookMongooseSchema.js";
import { HttpError } from "../../errorHandler/HttpError.js";
import { mapDocToBook } from "../../utils/tools.js";


class BookServiceImplMongo implements BookService {

    async addBook(book: Book): Promise<void> {
        await BookModel.create({
            title: book.title,
            author: book.author,
            genre: book.genre,
            year: book.year,
            status: book.status || BookStatus.IN_STOCK,
            pickList: book.pickList || []
        });
    }

    async getAllBooks(): Promise<Book[]> {
        const docs = await BookModel.find();
        return docs.map(doc => mapDocToBook (doc));
    }

    async getBookByAuthor(author: string): Promise<Book[]> {
        const docs = await BookModel.find({
            author: { $regex: new RegExp(`^${author}$`, "i") }
        });
        return docs.map(doc => mapDocToBook (doc));
    }

    async pickBook(id: string, reader: string, readerId: number): Promise<void> {
        const doc = await BookModel.findById(id);
        if (!doc) throw new HttpError(404, `Book with id: ${id} not found`);
        if (doc.status !== BookStatus.IN_STOCK)
            throw new HttpError(400, `Book is not available. Current status: ${doc.status}`);

        doc.pickList.push({
            readerId,
            readerName: reader,
            pickDate: new Date().toISOString(),
            returnDate: null
        });

        doc.status = BookStatus.ON_HAND;
        await doc.save();
    }

    async removeBook(id: string): Promise<Book> {
        const doc = await BookModel.findById(id);
        if (!doc) throw new HttpError(404, `Book with id: ${id} not found`);
        if (doc.status === BookStatus.ON_HAND)
            throw new HttpError(400, `Cannot remove book that is currently on hand`);

        doc.status = BookStatus.REMOVED;
        await doc.save();
        await BookModel.deleteOne({ _id: id });

        return mapDocToBook (doc);
    }

    async returnBook(id: string): Promise<void> {
        const doc = await BookModel.findById(id);
        if (!doc) throw new HttpError(404, `Book with id: ${id} not found`);
        if (doc.status !== BookStatus.ON_HAND)
            throw new HttpError(400, `Book is not on hand. Current status: ${doc.status}`);

        const activeRecord = [...doc.pickList]
            .reverse()
            .find(r => r.returnDate === null);

        if (activeRecord) activeRecord.returnDate = new Date().toISOString();

        doc.status = BookStatus.IN_STOCK;
        await doc.save();
    }
}

export const booksServiceMongo = new BookServiceImplMongo();
