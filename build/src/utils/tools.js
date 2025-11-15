import { BookGenres, BookStatus } from "../model/book.js";
import { HttpError } from "../errorHandler/HttpError.js";
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
        id: Math.trunc(Math.random() * 1000 + 1).toString(), //ToDo
        pickList: [],
        status: BookStatus.IN_STOCK,
        title: dto.title,
        year: dto.year
    };
};
export function mapDocToBook(doc) {
    return {
        id: doc._id.toString(),
        title: doc.title,
        author: doc.author,
        genre: doc.genre,
        year: doc.year,
        status: doc.status,
        pickList: doc.pickList
    };
}
