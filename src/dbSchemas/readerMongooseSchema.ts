import * as mongoose from "mongoose";
import {Roles} from "../utils/libTypes.ts";

const readerMongooseSchema = new mongoose.Schema({
    _id:{type:Number, length: 9, required: true},
    username: {type:String, required: true},
    email: {type:String, required:true},
    birthDate: {type:String, required:true},
    passHash: {type:String, required:true},
    roles:{type:[String], enum:Roles, required:true}
});

export const readerMongooseModel = mongoose.model('Reader', readerMongooseSchema, 'reader-collection');
