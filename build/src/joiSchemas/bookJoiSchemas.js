import Joi from "joi";
export const bookJoiSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
    quantity: Joi.number().positive().max(100)
});
export const readerJoiSchema = Joi.object({
    readerName: Joi.string().required(),
    readerId: Joi.number().positive().min(100000000).max(999999999).required()
});
