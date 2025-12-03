import express from "express";
import {bookController} from "../controllers/BookController.js";
import {bodyValidator} from "../middleware/bodyValidator.js";
import {bookJoiSchema, ReaderDtoJoiSchema} from "../utils/joiSchemas.js";

export const bookRouter = express.Router();

bookRouter.get('/', bookController.getAllBooks);
bookRouter.post('/', bodyValidator(bookJoiSchema), bookController.addBook); //(req, res) => {bookController.addBook(req,res)}
bookRouter.delete('/', bookController.removeBook); //(req, res) => {bookController.addBook(req,res)}
bookRouter.patch('/pick', bodyValidator(ReaderDtoJoiSchema), bookController.pickBook); //(req, res) => {bookController.addBook(req,res)}
bookRouter.patch('/return', bookController.returnBook); //(req, res) => {bookController.addBook(req,res)}
bookRouter.get('/author', bookController.getBookByAuthor); //(req, res) => {bookController.addBook(req,res)}