import {WebSocket} from "ws";

export interface UserCreateRequest {
    name: string,
    password: string
}

export interface User {
    id: number;
    name: string,
    password: string
}

export interface RoomUser {
    id: number,
    name: string,
    connection: WebSocket,
}

export interface Room {
    id: number,
    users: RoomUser[],
}