import * as usersDb from "../database/users";
import {WebSocketMessageTypes} from "./type";
import * as connectionsDb from "../database/connections";
import {CreateRoomResponse, createWsResponse} from "./common";
import * as roomsDb from "../database/rooms";
import * as userService from "../service/user";

export const sendAvailableRooms = () => {
    const rooms = roomsDb.getAvailableRooms()
    const roomsResponse: CreateRoomResponse[] = rooms.map(room => ({
        roomId: room.id,
        roomUsers: room.userIds.map(userId => {
            const user = usersDb.findUser(userId)
            return {
                name: user!!.name,
                index: user!!.id,
            }
        })
    }))
    const roomsMessage = createWsResponse(roomsResponse, WebSocketMessageTypes.UPDATE_ROOM)
    connectionsDb.getAllConnections().forEach(connection => {
        connection.send(roomsMessage)
    })
}

export const sendWinners = () => {
    const winners = userService.getWinners()
    const winnersMessage = createWsResponse(winners, WebSocketMessageTypes.UPDATE_WINNERS)
    connectionsDb.getAllConnections().forEach(connection => {
        connection.send(winnersMessage)
    })
}