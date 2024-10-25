// import {UsersDatabase} from "../database/users";
// import { v7 as generateUuid } from 'uuid';

// const db = UsersDatabase()

export interface RegistrationRequest {
    name: string,
    password: string,
}

export interface RegistrationResponse {
    name: string,
    index: number,
    error: boolean,
    errorText: string,
}

export const register = (request: RegistrationRequest): RegistrationResponse => {
    // const newUser: User = {
    //     id: generateUuid()
    // }
    return {
        name: request.name,
        index: 0,
        error: false,
        errorText: "",
    }
}