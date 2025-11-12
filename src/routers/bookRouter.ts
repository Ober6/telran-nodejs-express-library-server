import express from "express";
import {bookController} from "../controllers/BookController.js";

export const bookRouter = express.Router();

bookRouter.get('/books', bookController.getAllBooks.bind(bookController));
bookRouter.get('/books/author/:author', bookController.getBookByAuthor.bind(bookController));
bookRouter.post('/books', bookController.addBook.bind(bookController));
bookRouter.delete('/books/:id', bookController.removeBook.bind(bookController));
bookRouter.post('/books/:id/pick', bookController.pickBook.bind(bookController));
bookRouter.post('/books/:id/return', bookController.returnBook.bind(bookController));