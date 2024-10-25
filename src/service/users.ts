import {UsersDatabase} from "../database/users";
import {User} from "../database/types";

const db = UsersDatabase()

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

const createResponse = (user: User): RegistrationResponse => ({
    name: user.name,
    index: user.id,
    error: false,
    errorText: "",
})

const createErrorResponse = (error: string): RegistrationResponse => ({
    name: "",
    index: 0,
    error: true,
    errorText: error,
})

export const register = (request: RegistrationRequest): RegistrationResponse => {
    const user = db.findUserByName(request.name)
    if (user) {
        if(user.password == request.password) {
            return createResponse(user)
        } else {
            return createErrorResponse(`User with name ${request.name} already exists`)
        }
    } else {
        const user = db.createUser(request)
        return createResponse(user)
    }
}