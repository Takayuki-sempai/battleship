import {WebSocket} from "ws";
import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import * as connectionsDb from "../database/connections";
import * as broadcast from "./broadcast";
import * as usersDb from "../database/users";
import {UserEntity} from "../database/types";

interface RegistrationRequest {
    name: string,
    password: string,
}

interface RegistrationResponse {
    name: string,
    index: number,
    error: boolean,
    errorText: string,
}

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

const users = (request: RegistrationRequest): RegistrationResponse => {
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

export const handleRegistration = (connection: WebSocket, idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as RegistrationRequest
    const registerResponse = users(data)
    if(registerResponse.index !== 0) { //TODO Лучше делать маппинг тут и кидать исключения
        idHolder.id = registerResponse.index
        connectionsDb.addConnection(registerResponse.index, connection)
    }
    const userMessage = createWsResponse(registerResponse, WebSocketMessageTypes.REQ)
    connection.send(userMessage)
    broadcast.sendAvailableRooms() //TODO запретить заходить под пользователем если пользователь уже подключен
}