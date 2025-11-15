import { Schema, model } from "mongoose";
import { BookGenres, BookStatus } from "../model/book.js";
const pickRecordSchema = new Schema({
    readerId: { type: Number, required: true },
    readerName: { type: String, required: true },
    pickDate: { type: String, required: true },
    returnDate: { type: String, default: null }
}, { _id: false });
const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: {
        type: String,
        enum: Object.values(BookGenres),
        required: true
    },
    year: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(BookStatus),
        required: true,
        default: BookStatus.IN_STOCK
    },
    pickList: {
        type: [pickRecordSchema],
        default: []
    }
});
export const BookModel = model("Book", bookSchema, "book-collection");
