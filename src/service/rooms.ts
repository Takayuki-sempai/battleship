import {RoomEntity} from "../database/types";
import {addRoom, addToRoom, getEmptyRooms} from "../database/rooms";

export interface AddUserToRoomRequest {
    indexRoom: number,
}

export const getAvailableRooms = (): RoomEntity[] => {
    return getEmptyRooms()
}

export const createRoom = (userId: number) => {
    addRoom(userId)
}

export const addUserToRoom = (userId: number, request: AddUserToRoomRequest) => {
    return addToRoom(userId, request.indexRoom)
}
