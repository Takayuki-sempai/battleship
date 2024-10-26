import {WebSocketMessageTypes} from "./type";

export interface CreateRoomResponse {
    roomId: number,
    roomUsers: CreateRoomResponseUser[],
}

interface CreateRoomResponseUser {
    name: string,
    index: number,
}

export const createWsResponse = (responseData: object, responseType: WebSocketMessageTypes): string => {
    const messageResponse = {
        type: responseType,
        data: JSON.stringify(responseData),
        id: 0,
    }
    return JSON.stringify(messageResponse)
}