import {Reader, UpdateReaderDto} from "../model/reader.js";
import {Roles} from "../utils/libTypes.js";

export interface AccountService {
    createAccount: (reader:Reader)=>Promise<void>;
    getAccount: (id:number) => Promise<Reader>;
    removeAccount: (id: number) => Promise<Reader>;
    changePassword: (id: number, newPassword:string) => Promise<void>;
    editAccount: (id:number, newReaderData:UpdateReaderDto) => Promise<Reader>;
    addRole: (id:number, role:Roles) => Promise<Reader>;
    login: (id:number, password:string) => Promise<string>;
}