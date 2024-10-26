import {IdHolder} from "./type";
import * as game from "./game";
import * as broadcast from "./broadcast";
import * as roomsDb from "../database/rooms";

interface AddUserToRoomRequest {
    indexRoom: number,
}

export const handleCreateRoom = (idHolder: IdHolder) => {
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    roomsDb.addRoom(idHolder.id)
    broadcast.sendAvailableRooms()
}

export const handleAddUserToRoom = (idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as AddUserToRoomRequest
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    const room = roomsDb.addUserToRoom(idHolder.id, data.indexRoom)
    broadcast.sendAvailableRooms()
    game.sendCreateGame(room)
}
