import * as gameDb from "../database/games";
import {GamePlayer, GameShip, Point, StringPoint} from "../database/types";
import {WebSocket} from "ws";
import {
    AttackStatus,
    GameAttackRequest,
    GameAttackResponse,
    GamePlayerDto,
    GameShipsDto,
    GameTurnDto,
    ShipDto
} from "./gameTypes";

export const playerTurn = (gameId: number): GameTurnDto[] => {
    const game = gameDb.findGame(gameId)!! //TODO что если игра не найдена
    const currentPlayerId = game.isTurnsFirst ? game.players[0]!!.id : game.players[1]!!.id //TODO возможно добавть проверки
    game.isTurnsFirst = !game.isTurnsFirst
    return game.players.map(player => ({
        connection: player.connection,
        currentPlayer: currentPlayerId
    }))
}

export const getGameState = (gameId: number): GamePlayerDto[] => {
    const game = gameDb.findGame(gameId)!! //TODO что если игра не найдена
    return game.players.map((player) => ({
        connection: player.connection,
        id: player.id,
        gameShips: {
            gameId: gameId,
            ships: player.aliveShips.map(ship => ({
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
    return gameDb.createGame({isTurnsFirst: true, players: []})
}

const createShip = (requestShip: ShipDto): GameShip => {
    const cells = new Map<StringPoint, boolean>()
    if (requestShip.direction) {
        for (let i = 0; i < requestShip.length; i++) {
            cells.set(JSON.stringify({x: requestShip.position.x, y: requestShip.position.y + i}), false)
        }
    } else {
        for (let i = 0; i < requestShip.length; i++) {
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
        aliveShips: request.ships.map(createShip)
    }
    game.players.push(player)
}

export const attack = (request: GameAttackRequest): GameAttackResponse => {
    const game = gameDb.findGame(request.gameId)!! //TODO что если игра не найдена
    const attackedPlayer = game.players.find((player) => player.id !== request.indexPlayer)!! //TODO что если игра не найдена
    const attackPoint: Point = {
        x: request.x,
        y: request.y,
    }
    const createResult = (status: AttackStatus): GameAttackResponse => ({
        playersConnections: game.players.map(player => player.connection),
        attackInfo: {
            position: attackPoint,
            currentPlayer: request.indexPlayer,
            status: status,
        }
    })
    const stringAttackPoint = JSON.stringify(attackPoint)
    const attackedShip = attackedPlayer.aliveShips.find(ship => ship.cells.get(stringAttackPoint) != null)
    if(attackedShip == null) {
        return createResult(AttackStatus.MISS)
    }
    const alreadyHit = attackedShip.cells.get(stringAttackPoint)
    if(alreadyHit) {
        return createResult(AttackStatus.MISS)
    }
    attackedShip.cells.set(stringAttackPoint, true)
    if(Array.from(attackedShip.cells.values()).every(cellState => cellState)) {
        attackedPlayer.aliveShips.splice(attackedPlayer.aliveShips.indexOf(attackedShip), 1)
        return createResult(AttackStatus.KILLED)
    } else {
        return createResult(AttackStatus.SHOT)
    }
}