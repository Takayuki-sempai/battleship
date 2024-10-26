import {IdHolder} from "./type";
import {addUserToRoom, AddUserToRoomRequest, createRoom} from "../service/rooms";
import {sendCreateGame} from "./game";
import {sendAvailableRooms} from "./broadcast";

export const handleCreateRoom = (idHolder: IdHolder) => {
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    createRoom(idHolder.id)
    sendAvailableRooms()
}

export const handleAddUserToRoom = (idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as AddUserToRoomRequest
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    const room = addUserToRoom(idHolder.id, data)
    sendAvailableRooms()
    sendCreateGame(room)
}
