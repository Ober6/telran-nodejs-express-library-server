import Joi from 'joi';
import { BookGenres } from "../model/book.js";
export const bookDtoSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .required(),
    author: Joi.string()
        .min(1)
        .max(100)
        .required(),
    genre: Joi.string()
        .valid(...Object.values(BookGenres))
        .required(),
    year: Joi.number()
        .integer()
        .min(1000)
        .max(new Date().getFullYear())
        .required(),
    quantity: Joi.number()
        .integer()
        .min(1)
        .optional()
});
export const pickBookSchema = Joi.object({
    reader: Joi.string()
        .min(1)
        .max(100)
        .required(),
    readerId: Joi.number()
        .integer()
        .positive()
        .required()
});
