import * as gameDb from "../database/games";
import {CellStatus, GameBoard, GamePlayer, GameShip, ShipCounter} from "../database/types";
import {WebSocket} from "ws";
import {
    GameAttackRequest,
    GameAttackResponse,
    GamePlayerDto,
    GameShipsDto,
    GameTurnDto,
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
            ships: player.ships
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

export const addShip = (ship: GameShip, board: GameBoard) => {
    const shipCounter: ShipCounter = { lives: ship.length }
    if (ship.direction) {
        for (let i = 0; i < ship.length; i++) {
            board[ship.position.x]![ship.position.y + i] = shipCounter //TODO возможно проверки длины
        }
    } else {
        for (let i = 0; i < ship.length; i++) {
            board[ship.position.x + i]![ship.position.y] = shipCounter //TODO возможно проверки длины
        }
    }
}

export const addShips = (request: GameShipsDto, userId: number, connection: WebSocket) => {
    const game = gameDb.findGame(request.gameId)!! //TODO что если игра не найдена
    const board: GameBoard = Array.from({length: 40}, () => Array(10).fill(0))
    request.ships.map(ship => addShip(ship, board))
    const player: GamePlayer = {
        connection: connection,
        id: userId,
        board: board,
        ships: request.ships
    }
    game.players.push(player)
}

export const attack = (request: GameAttackRequest): GameAttackResponse => {
    const game = gameDb.findGame(request.gameId)!! //TODO что если игра не найдена
    const attackedPlayer = game.players.find((player) => player.id !== request.indexPlayer)!! //TODO что если игра не найдена
    const createResult = (status: CellStatus): GameAttackResponse => ({
        playersConnections: game.players.map(player => player.connection),
        attackInfo: {
            position: {
                x: request.x,
                y: request.y,
            },
            currentPlayer: request.indexPlayer,
            status: status,
        }
    })
    const attackedCell = attackedPlayer.board[request.x]![request.y]! //TODO Проверка обоих массивов
    let newCellStatus: CellStatus
    if(attackedCell == 0) {
        newCellStatus = CellStatus.MISS
    } else if(typeof attackedCell == 'object') {
        attackedCell.lives--
        if(attackedCell.lives == 0) {
            newCellStatus = CellStatus.KILLED
        } else {
            newCellStatus = CellStatus.SHOT
        }
    } else {
        newCellStatus = attackedCell
    }
    attackedPlayer.board[request.x]!![request.y] = newCellStatus
    return createResult(newCellStatus)
}