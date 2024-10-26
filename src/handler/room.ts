import {IdHolder} from "./type";
import {GameHandlers} from "./game";
import {BroadcastHandlers} from "./broadcast";
import {RoomDatabase} from "../database/rooms";

interface AddUserToRoomRequest {
    indexRoom: number,
}

export interface RoomHandlers {
    handleCreateRoom: (idHolder: IdHolder) => void,
    handleAddUserToRoom: (idHolder: IdHolder, request: string) => void,
}

export const createRoomHandlers = (roomDb: RoomDatabase, broadcastHandlers: BroadcastHandlers, gameHandlers: GameHandlers): RoomHandlers => {
    const handleCreateRoom = (idHolder: IdHolder) => {
        if (!idHolder.id) {
            console.log("User id not found")
            return
        }
        roomDb.addRoom(idHolder.id)
        broadcastHandlers.sendAvailableRooms()
    }

    const handleAddUserToRoom = (idHolder: IdHolder, request: string) => {
        const data = JSON.parse(request) as unknown as AddUserToRoomRequest
        if (!idHolder.id) {
            console.log("User id not found")
            return
        } //TODO запретить входить в свою комнату
        const room = roomDb.addUserToRoom(idHolder.id, data.indexRoom)
        broadcastHandlers.sendAvailableRooms()
        gameHandlers.sendCreateGame(room)
    }

    return {
        handleCreateRoom,
        handleAddUserToRoom,
    }
}
