import {IdHolder} from "./type";
import {sendCreateGame} from "./game";
import {sendAvailableRooms} from "./broadcast";
import {addRoom, addUserToRoom} from "../database/rooms";

interface AddUserToRoomRequest {
    indexRoom: number,
}

export const handleCreateRoom = (idHolder: IdHolder) => {
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    addRoom(idHolder.id)
    sendAvailableRooms()
}

export const handleAddUserToRoom = (idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as AddUserToRoomRequest
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    const room = addUserToRoom(idHolder.id, data.indexRoom)
    sendAvailableRooms()
    sendCreateGame(room)
}
