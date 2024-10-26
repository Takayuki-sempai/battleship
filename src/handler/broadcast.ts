import {WebSocketMessageTypes} from "./type";
import {CreateRoomResponse, createWsResponse} from "./common";
import {UserDatabase} from "../database/users";
import {RoomDatabase} from "../database/rooms";
import {ConnectionDatabase} from "../database/connectedUsers";

export interface BroadcastHandlers {
    sendAvailableRooms: () => void
}

export const createBroadcastHandlers = (usersDb: UserDatabase, roomsDb: RoomDatabase, connectionDb: ConnectionDatabase): BroadcastHandlers => {
    const sendAvailableRooms = () => {
        const rooms = roomsDb.getAvailableRooms()
        const roomsResponse: CreateRoomResponse[] = rooms.map(room => ({
            roomId: room.id,
            roomUsers: room.userIds.map(userId => {
                const user = usersDb.findUser(userId)
                return {
                    name: user!!.name, //TODO возможно обрабатывать
                    index: user!!.id,
                }
            })
        }))
        const roomsMessage = createWsResponse(roomsResponse, WebSocketMessageTypes.UPDATE_ROOM)
        connectionDb.getAllConnections().forEach(connection => {
            connection.send(roomsMessage)
        })
    }

    return {
        sendAvailableRooms,
    }
}