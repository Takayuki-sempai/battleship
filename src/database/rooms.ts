import {Room, RoomUser} from "./types";
import {IdGenerator} from "../utils/utils";

const rooms: Map<number, Room> = new Map();
const idGenerator = IdGenerator()

export const getEmptyRooms = (): Room[] => {
    return [...rooms.values()].filter(room => room.users.length === 1);
};

export const addRoom = (user: RoomUser) => {
    const roomId = idGenerator.getNextId()
    rooms.set(roomId, {
        id: roomId,
        users: [user]
    })
};