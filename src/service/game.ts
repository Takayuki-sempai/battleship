import * as gameDb from "../database/games";
import {
    CellState,
    CellStatus,
    CellWithStatus,
    GameBoard,
    GamePlayer,
    GameShip,
    Point,
    ShipCounter
} from "../database/types";
import {WebSocket} from "ws";
import {
    GameAttackRequest,
    GameAttackResponse,
    GamePlayerDto,
    GameRandomAttackRequest,
    GameShipsDto,
    GameTurnDto,
} from "./gameTypes";

export const playerTurn = (gameId: number, isChangePlayer: boolean): GameTurnDto[] => {
    const game = gameDb.findGame(gameId)!! //TODO что если игра не найдена
    if(isChangePlayer) game.isTurnsFirst = !game.isTurnsFirst
    const currentPlayerId = game.isTurnsFirst ? game.players[0]!!.id : game.players[1]!!.id //TODO возможно добавть проверки
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
    const shipCounter: ShipCounter = {lives: ship.length}
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
    const game = gameDb.findGame(request.gameId)! //TODO что если игра не найдена
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

const getCellState = (board: GameBoard, point: Point): CellState => board[point.x]![point.y]! //TODO Проверка обоих массивов
const setCellStatus = (board: GameBoard, cell: Point, status: CellStatus): CellWithStatus => {
    board[cell.x]![cell.y]! = status //TODO Проверка обоих массивов
    return {cell, status}
}

const calculateNearbyCells = (centerPoint: Point): Point[] => {
    const  nearbyCells: Point[] = [-1, 0, 1].flatMap(xOffset => [-1, 0, 1].map(yOffset => ({x: centerPoint.x + xOffset, y: centerPoint.y + yOffset})))
    return nearbyCells.filter(point => point.x < 10 && point.x >= 0 && point.y < 10 && point.y >= 0 && !(point.x === centerPoint.x && point.y === centerPoint.y))
}

const setSurroundingMisses = (board: GameBoard, startPoint: Point, checkedShipCells: string[]): CellWithStatus[] => {
    const currentCellState = getCellState(board, startPoint)
    if(currentCellState == 0){
        const cellWithNewStatus = setCellStatus(board, startPoint, CellStatus.MISS)
        return [cellWithNewStatus]
    } else if(currentCellState === CellStatus.KILLED || currentCellState === CellStatus.SHOT){
        checkedShipCells.push(JSON.stringify(startPoint))
        const nearbyCells = calculateNearbyCells(startPoint)
        return nearbyCells.filter(cell => !checkedShipCells.includes(JSON.stringify(cell))).flatMap(cell => setSurroundingMisses(board, cell, checkedShipCells))
    } else {
        return []
    }
}

export const attack = (request: GameAttackRequest): GameAttackResponse => {
    const game = gameDb.findGame(request.gameId)! //TODO что если игра не найдена
    const attackedPlayer = game.players.find((player) => player.id !== request.indexPlayer)!! //TODO что если игра не найдена
    const attackedCellPoint = {x: request.x, y: request.y,}
    const attackedCell = getCellState(attackedPlayer.board, attackedCellPoint)
    let affectedCells: CellWithStatus[] = []
    let isMiss = false
    if (attackedCell == 0) {
        const cellWithStatus = setCellStatus(attackedPlayer.board, attackedCellPoint, CellStatus.MISS)
        affectedCells.push(cellWithStatus)
        isMiss = true
    } else if (typeof attackedCell == 'object') {
        attackedCell.lives--
        if (attackedCell.lives == 0) {
            const cellWithStatus = setCellStatus(attackedPlayer.board, attackedCellPoint, CellStatus.KILLED)
            affectedCells.push(cellWithStatus)
            const additionalCells = setSurroundingMisses(attackedPlayer.board, attackedCellPoint, [])
            affectedCells.push(...additionalCells)
        } else {
            const cellWithStatus = setCellStatus(attackedPlayer.board, attackedCellPoint, CellStatus.SHOT)
            affectedCells.push(cellWithStatus)
        }
    }
    return {
        playersConnections: game.players.map(player => player.connection),
        isMiss: isMiss,
        attackInfos: affectedCells.map(cell => ({
            position: cell.cell,
            currentPlayer: request.indexPlayer,
            status: cell.status,
        }))
    }
}

const isCellNotShooted = (value: CellState): boolean =>
    value === 0 || typeof value === 'object'

export const getNextFreeCell = (request: GameRandomAttackRequest): Point => {
    const game = gameDb.findGame(request.gameId)! //TODO что если игра не найдена
    const attackedPlayer = game.players.find((player) => player.id !== request.indexPlayer)!! //TODO что если игра не найдена
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            if(isCellNotShooted(attackedPlayer.board[j]![i]!)) {  //TODO Проверка обоих массивов
                return {x: j, y: i}
            }
        }
    }
    return {x: 0, y: 0} //TODO возможно ошибку кидать
}