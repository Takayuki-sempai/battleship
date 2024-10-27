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
    ships: GameShip[]
}

export interface GameShip {
    startCell: Cell,
    cells: Map<StringCell, boolean>,
    type: ShipType,
    direction: boolean,
    length: number,
}

export type StringCell = string

export interface Cell {
    x: number,
    y: number,
}