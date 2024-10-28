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

export interface GameAttackRequest {
    x: number,
    y: number,
    gameId: number,
    indexPlayer: number
}

export interface GameAttackResponse {
    playersConnections: WebSocket[],
    isMiss: boolean,
    attackInfos: GameAttackInfo[]
}

export interface GameAttackInfo {
    position: Point,
    currentPlayer: number,
    status: CellStatus
}