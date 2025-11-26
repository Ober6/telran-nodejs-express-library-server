
export type ReaderDto = {
    id:number;
    username:string;
    email:string;
    password: string;
    birthDate:string;
}

export type UpdateReaderDto = {
    username:string;
    email:string;
    birthDate:string;
}

export type Reader = {
    _id:number;
    username:string;
    email:string;
    passHash: string;
    birthDate:string;
}