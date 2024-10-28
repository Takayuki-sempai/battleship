import {WebSocket} from "ws";
import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import * as connectionsDb from "../database/connections";
import * as broadcast from "./broadcast";
import {RegistrationRequest} from "../service/userTypes";
import * as userService from "../service/user";

export const handleRegistration = (connection: WebSocket, idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as RegistrationRequest
    const registerResponse = userService.register(data)
    if(registerResponse.index !== 0) { //TODO Лучше делать маппинг тут и кидать исключения
        idHolder.id = registerResponse.index
        connectionsDb.addConnection(registerResponse.index, connection)
    }
    const userMessage = createWsResponse(registerResponse, WebSocketMessageTypes.REQ)
    connection.send(userMessage)
    broadcast.sendAvailableRooms() //TODO запретить заходить под пользователем если пользователь уже подключен
    broadcast.sendWinners()
}