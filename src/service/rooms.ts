import {RoomUser, User} from "../database/types";
import {addRoom, getEmptyRooms} from "../database/rooms";
import {WebSocket} from "ws";

export interface RoomResponse {
    roomId: number,
    roomUsers: RoomResponseUser[],
}

interface RoomResponseUser {
    name: string,
    index: number,
}

export const getAvailableRooms = (): RoomResponse[] => {
    return getEmptyRooms().map(room => ({
        roomId: room.id,
        roomUsers: room.users.map(user => ({
            name: user.name,
            index: user.id,
        }))
    }))
}

export const createRoom = (connection: WebSocket, user: User) => {
    const roomUser: RoomUser = {
        id: user.id,
        name: user.name,
        connection: connection,
    }
    addRoom(roomUser)
}
