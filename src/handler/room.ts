import {WebSocket} from "ws";
import {IdHolder, WebSocketMessageTypes} from "./type";
import {createWsResponse} from "./common";
import {createRoom, getAvailableRooms} from "../service/rooms";
import {findUser} from "../database/users";

export const handleCreateRoom = (connection: WebSocket, idHolder: IdHolder) => {
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    const user = findUser(idHolder.id)
    if(!user) {
        console.log("User not found")
        return
    }
    createRoom(connection, user)
    const rooms = getAvailableRooms()
    const roomsMessage = createWsResponse(rooms, WebSocketMessageTypes.UPDATE_ROOM)
    connection.send(roomsMessage)
}