import {WebSocket} from "ws";
import {Point, ShipType} from "../database/types";

export interface GamePlayerDto {
    connection: WebSocket,
    gameShips: GameShipsDto
}

export interface GameTurnDto {
    connection: WebSocket,
    currentPlayer: number
}

export interface GameShipsDto {
    gameId: number,
    ships: ShipDto[]
}

export interface ShipDto {
    position: Point,
    direction: boolean,
    type: ShipType,
    length: number,
}

export interface GameAttackRequest {
    x: number,
    y: number,
    gameId: number,
    indexPlayer: number
}

export interface GameAttackResponse {
    playersConnections: WebSocket[],
    attackInfo: GameAttackInfo
}

export interface GameAttackInfo {
    position: Point,
    currentPlayer: number,
    status: AttackStatus
}

export enum AttackStatus {
    MISS = "miss",
    KILLED = "killed",
    SHOT = "shot"
}