import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import * as connectionsDb from "../database/connections";
import * as gameService from "../service/game";
import {RoomEntity} from "../database/types";
import * as userService from "../service/user";
import * as broadcast from "./broadcast";
import {
    GameAttackRequest,
    GameAttackResponse,
    GameRandomAttackRequest,
    GameShipsDto
} from "../service/gameTypes";
import {WebSocket} from "ws";

interface CreateGameResponse {
    idGame: number,
    idPlayer: number
}

export const sendCreateGame = (room: RoomEntity) => {
    const gameId = gameService.createGame()
    room.userIds.forEach(userId => {
        const response: CreateGameResponse = {
            idGame: gameId,
            idPlayer: userId
        }
        const message = createWsResponse(response, WebSocketMessageTypes.CREATE_GAME)
        connectionsDb.findConnectionById(userId).send(message)
    })
}

const sendGameTurn = (gameId: number, isChangePlayer: boolean)=> {
    const turnInfo = gameService.playerTurn(gameId, isChangePlayer)
    turnInfo.forEach(info => {
        const message = createWsResponse({ currentPlayer: info.currentPlayer }, WebSocketMessageTypes.TURN)
        info.connection.send(message)
    })
}

const sendStartGame = (gameId: number)=> {
    const gamePlayers = gameService.getGameState(gameId)
    gamePlayers.forEach(player => {
        const message = createWsResponse(player.gameShips, WebSocketMessageTypes.START_GAME)
        player.connection.send(message)
    })
    sendGameTurn(gameId, false)
}

export const handleAddShips = (idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as GameShipsDto
    const userId = idHolder.id!!
    const userConnection = connectionsDb.findConnectionById(idHolder.id!!) //TODO проверка
    gameService.addShips(data, userId, userConnection)
    if(gameService.isGamePrepared(data.gameId)) {
        sendStartGame(data.gameId)
    }
}

const sendGameFinish = (playersConnections: WebSocket[], winPlayer: number)=> {
    const finishMessage = createWsResponse({winPlayer: winPlayer}, WebSocketMessageTypes.FINISH)
    playersConnections.forEach(connection => {
        connection.send(finishMessage)
    })
    userService.addWins(winPlayer)
    broadcast.sendWinners()
}

const handleAttackParsed = (data: GameAttackRequest) => {
    const attackResult = gameService.attack(data)
    attackResult.attackInfos.map(attackInfo => {
        const attackResponse: GameAttackResponse = {...attackInfo, currentPlayer: data.indexPlayer}
        const message = createWsResponse(attackResponse, WebSocketMessageTypes.ATTACK)
        attackResult.playersConnections.forEach(connection => {
            connection.send(message)
        })
    })
    sendGameTurn(data.gameId, attackResult.isMiss)
    if(attackResult.isFinish) {
        sendGameFinish(attackResult.playersConnections, data.indexPlayer)
    }
}

export const handleAttack = (request: string) => {
    const data = JSON.parse(request) as unknown as GameAttackRequest
    handleAttackParsed(data)
}

export const handleRandomAttack = (request: string) => {
    const data = JSON.parse(request) as unknown as GameRandomAttackRequest
    const freeCell = gameService.getNextFreeCell(data)
    const attackRequest: GameAttackRequest = {...data, x: freeCell.x, y: freeCell.y}
    handleAttackParsed(attackRequest)
}