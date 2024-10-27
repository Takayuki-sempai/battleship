import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import * as connectionsDb from "../database/connections";
import * as gameService from "../service/game";
import {CellStatus, RoomEntity} from "../database/types";
import * as roomsDb from "../database/rooms";
import * as broadcast from "./broadcast";
import {GameAttackRequest, GameShipsDto} from "../service/gameTypes";

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

const sendGameTurn = (gameId: number)=> {
    const turnInfo = gameService.playerTurn(gameId)
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
    sendGameTurn(gameId)
}

export const handleAddShips = (idHolder: IdHolder, request: string) => {
    const data = JSON.parse(request) as unknown as GameShipsDto
    const userId = idHolder.id!!
    const userConnection = connectionsDb.findConnectionById(idHolder.id!!) //TODO проверка
    gameService.addShips(data, userId, userConnection)
    if(gameService.isGamePrepared(data.gameId)) {
        sendStartGame(data.gameId)
    }
    if(!idHolder.id) {
        console.log("User id not found")
        return
    }
    roomsDb.addRoom(idHolder.id)
    broadcast.sendAvailableRooms()
}

export const handleAttack = (request: string) => {
    const data = JSON.parse(request) as unknown as GameAttackRequest
    const attackResult = gameService.attack(data)
    const message = createWsResponse(attackResult.attackInfo, WebSocketMessageTypes.ATTACK)
    attackResult.playersConnections.forEach(connection => {
        connection.send(message)
    })
    if(attackResult.attackInfo.status == CellStatus.MISS) {
        sendGameTurn(data.gameId)
    }
}