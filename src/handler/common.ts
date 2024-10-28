import {WebSocketMessageTypes} from "./type";

export interface CreateRoomResponse {
    roomId: number,
    roomUsers: CreateRoomResponseUser[],
}

interface CreateRoomResponseUser {
    name: string,
    index: number,
}

export const createWsResponseString = (responseData: string, responseType: WebSocketMessageTypes): string => {
    const messageResponse = {
        type: responseType,
        data: responseData,
        id: 0,
    }
    return JSON.stringify(messageResponse)
}

export const createWsResponse = (responseData: object, responseType: WebSocketMessageTypes): string => {
    return createWsResponseString(JSON.stringify(responseData), responseType)
}