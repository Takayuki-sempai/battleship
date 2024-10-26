import {RoomEntity} from "./types";
import {IdGenerator} from "../utils/utils";

export interface RoomDatabase {
    getAvailableRooms: () => RoomEntity[],
    addRoom: (userId: number) => void,
    addUserToRoom: (userId: number, roomId: number) => RoomEntity
}

export const createRoomDatabase = (): RoomDatabase => {
    const rooms: Map<number, RoomEntity> = new Map();
    const idGenerator = IdGenerator()

    const getAvailableRooms = (): RoomEntity[] => {
        return [...rooms.values()].filter(room => room.userIds.length === 1);
    };

    const addRoom = (userId: number) => {
        const roomId = idGenerator.getNextId()
        rooms.set(roomId, {
            id: roomId,
            userIds: [userId]
        })
    };

    const addUserToRoom = (userId: number, roomId: number): RoomEntity => {
        const room = rooms.get(roomId)!!;//TODO EntityNotFoundException
        room.userIds.push(userId);
        return room;
    }

    return {
        getAvailableRooms,
        addRoom,
        addUserToRoom
    }
}