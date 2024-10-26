import {RoomEntity} from "./types";
import {IdGenerator} from "../utils/utils";

const rooms: Map<number, RoomEntity> = new Map();
const idGenerator = IdGenerator()

export const getEmptyRooms = (): RoomEntity[] => {
    return [...rooms.values()].filter(room => room.userIds.length === 1);
};

export const addRoom = (userId: number) => {
    const roomId = idGenerator.getNextId()
    rooms.set(roomId, {
        id: roomId,
        userIds: [userId]
    })
};

export const addToRoom = (userId: number, roomId: number): RoomEntity => {
    const room = rooms.get(roomId)!!;//TODO EntityNotFoundException
    room.userIds.push(userId);
    return room;
}