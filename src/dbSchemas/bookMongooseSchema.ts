import * as mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import {Book, BookGenres, BookStatus} from "../model/book.js";

const pickListSchema = new mongoose.Schema({
    readerId: {type: Number, min: 100000000, max: 999999999, required:true},
    readerName: {type: String, required:true},
    pickDate: {type: String, required:true},
    returnDate: {type: String, default: null}
}, {
    _id:false
});

const bookMongooseSchema = new mongoose.Schema({
    _id:{type:String, default: () => uuidv4(),unique:true },
    title:{type:String, required: true},
    author:{type:String, required: true},
    year:{type:Number, min:1900, max:2050, required: true},
    genre:{type: String, enum:Object.values(BookGenres), required:true},
    status:{type: String, enum:Object.values(BookStatus), required:true},
    pickList: {type:[pickListSchema], default: []}
});

export const bookMongooseModel = mongoose.model<Book>('Book', bookMongooseSchema, 'book-collection')