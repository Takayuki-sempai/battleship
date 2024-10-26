import {findUser} from "../database/users";
import {WebSocketMessageTypes} from "./type";
import {getAllConnections} from "../database/connectedUsers";
import {CreateRoomResponse, createWsResponse} from "./common";
import {getAvailableRooms} from "../database/rooms";

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