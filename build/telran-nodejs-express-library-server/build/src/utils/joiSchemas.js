import Joi from "joi";
export const bookJoiSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
    quantity: Joi.number().positive().max(100)
});
// export const readerJoiSchema = Joi.object({
//     readerName: Joi.string().required(),
//     readerId: Joi.number().positive().min(100000000).max(999999999).required()
// })
export const ReaderDtoJoiSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000).required(),
    username: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).required(),
    birthDate: Joi.string().isoDate().required() //2025-11-27
});
export const ChangePassDtoJoiSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000).required(),
    oldPassword: Joi.string().alphanum().min(8).required(),
    newPassword: Joi.string().alphanum().min(8).required(),
});
export const UpdateAccountJoiSchema = Joi.object({
    username: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    birthDate: Joi.string().isoDate().required()
});
export const LoginJoiSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000).required(),
    password: Joi.string().alphanum().min(8).required()
});
