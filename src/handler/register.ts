import {register, RegistrationRequest} from "../service/users";
import {WebSocket} from "ws";
import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import {getAvailableRooms} from "../service/rooms";

export const handleRegistration = (connection: WebSocket, idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as RegistrationRequest
    const registerResponse = register(data)
    idHolder.id = registerResponse.index
    const userMessage = createWsResponse(registerResponse, WebSocketMessageTypes.REQ)
    connection.send(userMessage)

    const rooms = getAvailableRooms()
    const roomsMessage = createWsResponse(rooms, WebSocketMessageTypes.UPDATE_ROOM)
    connection.send(roomsMessage)
}