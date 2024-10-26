import {WebSocket} from "ws";
import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import {UserDatabase} from "../database/users";
import {UserEntity} from "../database/types";
import {ConnectionDatabase} from "../database/connectedUsers";
import {BroadcastHandlers} from "./broadcast";

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

export interface UserHandlers {
    handleRegistration: (connection: WebSocket, idHolder: IdHolder, request: string) => void
}

export const createUserHandlers = (userDb: UserDatabase, connectionDb: ConnectionDatabase, broadcastHandlers: BroadcastHandlers): UserHandlers => {
    const register = (request: RegistrationRequest): RegistrationResponse => {
        const user = userDb.findUserByName(request.name)
        if (user) {
            if (user.password == request.password) {
                return createResponse(user)
            } else {
                return createErrorResponse(`User with name ${request.name} already exists`)
            }
        } else {
            const user = userDb.createUser(request)
            return createResponse(user)
        }
    }

    const handleRegistration = (connection: WebSocket, idHolder: IdHolder, request: string) => {
        const data = JSON.parse(request) as unknown as RegistrationRequest
        const registerResponse = register(data)
        if (registerResponse.index !== 0) { //TODO Лучше делать маппинг тут и кидать исключения
            idHolder.id = registerResponse.index
            connectionDb.addConnection(registerResponse.index, connection)
        }
        const userMessage = createWsResponse(registerResponse, WebSocketMessageTypes.REQ)
        connection.send(userMessage)
        broadcastHandlers.sendAvailableRooms()
    }

    return { handleRegistration }
}