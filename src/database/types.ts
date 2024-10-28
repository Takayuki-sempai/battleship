import {WebSocket} from "ws";

export interface UserCreateRequest {
    name: string,
    password: string
}

export interface UserEntity {
    id: number;
    name: string,
    password: string,
    wins: number,
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
    board: GameBoard
    ships: GameShip[]
}

export type CellState = CellStatus | ShipCounter | 0
export type GameBoard = CellState[][]

export interface ShipCounter {
    lives: number
}

export enum CellStatus {
    MISS = "miss",
    KILLED = "killed",
    SHOT = "shot"
}

export interface GameShip {
    position: Point,
    direction: boolean,
    type: ShipType,
    length: number,
}

export interface Point {
    x: number,
    y: number,
}

export interface CellWithStatus {
    cell: Point,
    status: CellStatus,
}

export interface WinnerEntity {
    id: number,
    name: string,
    wins: number
}