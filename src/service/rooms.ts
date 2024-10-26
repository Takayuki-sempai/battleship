export interface RoomResponse {
    roomId: number,
    roomUsers: RoomUser[],
}

interface RoomUser {
    name: string,
    index: number,
}

export const getAvailableRooms = (): RoomResponse[] => {
    return [
        {
            roomId: 0,
            roomUsers: [
                {
                    name: "testUser",
                    index: 0
                }
            ]
        }
    ]
}