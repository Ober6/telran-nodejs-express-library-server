import Joi from "joi";
import {ReaderDto, UpdateReaderDto} from "../model/reader.js";

export const createReaderJoiSchema = Joi.object<ReaderDto>({
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

export const updateReaderJoiSchema = Joi.object<UpdateReaderDto>({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    birthDate: Joi.string().required()
});
