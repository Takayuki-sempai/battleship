import {register, RegistrationRequest} from "../service/users";
import {WebSocket} from "ws";
import {createWsResponse, sendAvailableRooms} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import {addConnection} from "../database/connectedUsers";

export const handleRegistration = (connection: WebSocket, idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as RegistrationRequest
    const registerResponse = register(data)
    if(registerResponse.index !== 0) { //TODO Лучше делать маппинг тут и кидать исключения
        idHolder.id = registerResponse.index
        addConnection(registerResponse.index, connection)
    }
    const userMessage = createWsResponse(registerResponse, WebSocketMessageTypes.REQ)
    connection.send(userMessage)
    sendAvailableRooms()
}