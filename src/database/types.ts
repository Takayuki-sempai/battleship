export interface UserCreateRequest {
    name: string,
    password: string
}

export interface UserEntity {
    id: number;
    name: string,
    password: string
}

export interface RoomEntity {
    id: number,
    userIds: number[],
}