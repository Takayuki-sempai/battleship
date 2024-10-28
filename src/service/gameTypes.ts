import {WebSocket} from "ws";
import {CellStatus, GameShip, Point} from "../database/types";

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
    ships: GameShip[]
}

export interface GameRandomAttackRequest {
    gameId: number,
    indexPlayer: number
}

export interface GameAttackRequest {
    x: number,
    y: number,
    gameId: number,
    indexPlayer: number
}

export interface GameAttackResult {
    playersConnections: WebSocket[],
    isMiss: boolean,
    isFinish: boolean,
    attackInfos: GameAttackInfo[]
}

export interface GameAttackInfo {
    position: Point,
    status: CellStatus
}

export interface GameAttackResponse {
    position: Point,
    status: CellStatus,
    currentPlayer: number,
}