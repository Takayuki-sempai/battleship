import {WebSocketMessageTypes} from "./type";
import {getAvailableRooms} from "../service/rooms";
import {getAllConnections} from "../database/connectedUsers";
import {findUser} from "../database/users";

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

export const sendAvailableRooms = () => {
    const rooms = getAvailableRooms()
    const roomsResponse: CreateRoomResponse[] = rooms.map(room => ({
        roomId: room.id,
        roomUsers: room.userIds.map(userId => {
            const user = findUser(userId)
            return {
                name: user!!.name, //TODO возможно обрабатывать
                index: user!!.id,
            }
        })
    }))
    const roomsMessage = createWsResponse(roomsResponse, WebSocketMessageTypes.UPDATE_ROOM)
    getAllConnections().forEach(connection => {
        connection.send(roomsMessage)
    })
}