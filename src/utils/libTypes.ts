import {Request} from "express";

export interface AuthRequest extends Request{
    userId?:number,
    userName?: string,
    roles?: Roles[];
}

export enum Roles {
    READER = "reader",
    ADMIN = "admin",
    LIBRARIAN = "librarian",
    SUPERVISOR = "super",
    PREMIUM_USER = "premium_user"
}

