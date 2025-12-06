import {Book, BookDto, BookGenres, BookStatus} from "../model/book.js";
import {HttpError} from "../errorHandler/HttpError.js";
import { v4 as uuidv4 } from 'uuid';
import {Reader, ReaderDto} from "../model/reader.js";
import bcrypt from "bcryptjs";
import {Roles} from "./libTypes.js";
import jwt from  "jsonwebtoken";
import {options} from "joi";

export function getGenre(genre: string) {
    const gen = Object.values(BookGenres).find(v => v === genre)
    if(!gen) throw new HttpError(400, "Wrong genre")
    return gen;
}

export function getRole(data: string) {
    const role  = Object.values(Roles).find(v => v === data)
    if(!role) throw new HttpError(400, "Wrong role");
    return role;
}

export const convertBookDtoToBook = (dto:BookDto):Book => {
    return {
        author: dto.author,
        genre: getGenre(dto.genre),
        // id: Math.trunc(Math.random()*1000 + 1).toString(),
        _id: uuidv4(),
        pickList: [],
        status: BookStatus.IN_STOCK,
        title: dto.title,
        year: dto.year
    }
}

export const convertReaderDtoToReader = (readerDto:ReaderDto) => {
    const salt = bcrypt.genSaltSync(10);
    const reader:Reader = {
        _id: +readerDto.id,
        birthDate: readerDto.birthDate,
        email: readerDto.email,
        passHash: bcrypt.hashSync(readerDto.password, salt),
        username: readerDto.username,
        roles: [Roles.READER]
    }
    return reader;
}

export const getJWT = (id: number, roles: Roles[])=> {
    let payload = {roles:JSON.stringify(roles)};
    let secret = process.env.JWT_SECRET || 'new-secret-key';
    const options = {
        expiresIn: process.env.JWT_EXP as any || "1h",
        subject:id.toString()
    }
    return jwt.sign(payload, secret, options);
}