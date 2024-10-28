import {RoomEntity} from "./types";
import {IdGenerator} from "../utils/utils";

const rooms: Map<number, RoomEntity> = new Map();
const idGenerator = IdGenerator()

export const getAvailableRooms = (): RoomEntity[] => {
    return [...rooms.values()].filter(room => room.userIds.length === 1);
};

export const addRoom = (userId: number) => {
    const roomId = idGenerator.getNextId()
    rooms.set(roomId, {
        id: roomId,
        userIds: [userId]
    })
};

export const addUserToRoom = (userId: number, roomId: number): RoomEntity => {
    const room = rooms.get(roomId)!!;
    room.userIds.push(userId);
    return room;
}