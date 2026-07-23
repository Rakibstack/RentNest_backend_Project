import { Role } from "../../../generated/prisma/enums";

export interface IcreateUser {

    name: string;
    email: string;
    password : string;
    phone ?: string;
    profileImage ? : string;
    role : Role
}