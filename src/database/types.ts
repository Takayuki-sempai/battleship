import {WebSocket} from "ws";

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

export enum ShipType {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    HUGE = "huge"
}

export interface GameEntity {
    isTurnsFirst: boolean
    players: GamePlayer[]
}

export interface GamePlayer {
    connection: WebSocket,
    id: number,
    aliveShips: GameShip[]
}

export interface GameShip {
    startCell: Point,
    cells: Map<StringPoint, boolean>,
    type: ShipType,
    direction: boolean,
    length: number,
}

export type StringPoint = string

export interface Point {
    x: number,
    y: number,
}