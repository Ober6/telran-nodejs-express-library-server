import { BookGenres, BookStatus } from "../model/book.js";
import { HttpError } from "../errorHandler/HttpError.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcryptjs";
export function getGenre(genre) {
    const gen = Object.values(BookGenres).find(v => v === genre);
    if (!gen)
        throw new HttpError(400, "Wrong genre");
    return gen;
}
export const convertBookDtoToBook = (dto) => {
    return {
        author: dto.author,
        genre: getGenre(dto.genre),
        // id: Math.trunc(Math.random()*1000 + 1).toString(),
        _id: uuidv4(),
        pickList: [],
        status: BookStatus.IN_STOCK,
        title: dto.title,
        year: dto.year
    };
};
export const convertReaderDtoToReader = (readerDto) => {
    const salt = bcrypt.genSaltSync(10);
    const reader = {
        _id: readerDto.id,
        birthDate: readerDto.birthDate,
        email: readerDto.email,
        passHash: bcrypt.hashSync(readerDto.password, salt),
        username: readerDto.username
    };
    return reader;
};
