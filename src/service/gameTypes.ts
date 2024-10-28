import {CellStatus, GameShip, GameSocket, Point} from "../database/types";

export interface GamePlayerDto {
    connection: GameSocket,
    gameShips: GameShipsDto
}

export interface GamePlayerInfoDto {
    connection: GameSocket,
    userId: number
}

export interface GameTurnDto {
    connection: GameSocket,
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
    playersConnections: GameSocket[],
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