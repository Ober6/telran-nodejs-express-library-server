import * as mongoose from "mongoose";
import {Reader} from "../model/reader.js";

const readerMongooseSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    passHash: { type: String, required: true },
    birthDate: { type: String, required: true }
});

export const readerMongooseModel = mongoose.model<Reader>('Reader', readerMongooseSchema, 'reader-collection');
