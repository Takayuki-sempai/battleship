import {register, RegistrationRequest} from "../service/users";
import {WebSocket} from "ws";
import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";

export const handleRegistration = (connection: WebSocket, idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as RegistrationRequest
    const registerResponse = register(data)
    idHolder.id = registerResponse.index
    const response = createWsResponse(registerResponse, WebSocketMessageTypes.REQ)
    connection.send(response)
}