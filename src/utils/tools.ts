import {Book, BookDto, BookGenres, BookStatus} from "../model/book.js";
import {HttpError} from "../errorHandler/HttpError.js";

export function getGenre(genre: string) {
    const gen = Object.values(BookGenres).find(v => v === genre)
    if(!gen) throw new HttpError(400, "Wrong genre")
    return gen;
}

export const convertBookDtoToBook = (dto:BookDto):Book => {
    return {
        author: dto.author,
        genre: getGenre(dto.genre),
        id: Math.trunc(Math.random()*1000 + 1).toString(), //ToDo
        pickList: [],
        status: BookStatus.IN_STOCK,
        title: dto.title,
        year: dto.year
    }
}