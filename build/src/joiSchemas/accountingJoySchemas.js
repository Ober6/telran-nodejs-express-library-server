import Joi from "joi";
export const createReaderJoiSchema = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    birthDate: Joi.string().required()
});
export const changePasswordJoiSchema = Joi.object({
    id: Joi.number().required(),
    newPassword: Joi.string().required()
});
export const updateReaderJoiSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    birthDate: Joi.string().required()
});
