import * as usersDb from "../database/users";
import {RegistrationRequest, RegistrationResponse, WinnersResponse} from "./userTypes";
import {UserEntity} from "../database/types";

const createResponse = (user: UserEntity): RegistrationResponse => ({
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
    const user = usersDb.findUserByName(request.name)
    if (user) {
        if(user.password == request.password) {
            return createResponse(user)
        } else {
            return createErrorResponse(`User with name ${request.name} already exists`)
        }
    } else {
        const user = usersDb.createUser(request)
        return createResponse(user)
    }
}

export const getWinners = (): WinnersResponse[] => {
    const users = usersDb.findAll()
    return users.filter(user => user.wins > 0)
        .map(user => ({name: user.name, wins: user.wins}))
        .sort((first, second) => second.wins - first.wins)
}

export const addWins = (userId: number) => {
    const user = usersDb.findUser(userId)! //TODO возможно обрабатывать
    user.wins++
}