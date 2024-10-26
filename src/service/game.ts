import * as gameDb from "../database/games";
import {Cell, GamePlayer, GameShip, ShipType, StringCell} from "../database/types";
import {WebSocket} from "ws";

export interface GamePlayerDto {
    connection: WebSocket,
    id: number,
    gameShips: GameShipsDto
}

export interface GameShipsDto {
    gameId: number,
    ships: ShipDto[]
}

export interface ShipDto {
    position: Cell,
    direction: boolean,
    type: ShipType,
    length: number,
}

export const getGameState = (gameId: number): GamePlayerDto[] => {
    const game = gameDb.findGame(gameId)!! //TODO что если игра не найдена
    return game.players.map((player) => ({
        connection: player.connection,
        id: player.id,
        gameShips: {
            gameId: gameId,
            ships: player.ships.map(ship => ({
                position: ship.startCell,
                direction: ship.direction,
                type: ship.type,
                length: ship.length,
            })),
        }
    }))
}

export const isGamePrepared = (gameId: number): boolean => {
    const game = gameDb.findGame(gameId)!! //TODO что если игра не найдена
    return game.players.length == 2
}

export const createGame = (): number => {
    return gameDb.createGame({players: []})
}

const createShip = (requestShip: ShipDto): GameShip => {
    const cells = new Map<StringCell, boolean>()
    if(requestShip.direction) {
        for(let i = 0; i < requestShip.length; i++) {
            cells.set(JSON.stringify({x: requestShip.position.x, y: requestShip.position.y + i}), false)
        }
    } else {
        for(let i = 0; i < requestShip.length; i++) {
            cells.set(JSON.stringify({x: requestShip.position.x + i, y: requestShip.position.y}), false)
        }
    }
    return {
        startCell: requestShip.position,
        cells: cells,
        direction: requestShip.direction,
        type: requestShip.type,
        length: requestShip.length,
    }
}

export const addShips = (request: GameShipsDto, userId: number, connection: WebSocket) => {
    const game = gameDb.findGame(request.gameId)!! //TODO что если игра не найдена
    const player: GamePlayer = {
        connection: connection,
        id: userId,
        ships: request.ships.map(createShip)
    }
    game.players.push(player)
}
