import {createWsResponse} from "./common";
import {IdHolder, WebSocketMessageTypes} from "./type";
import * as connectionsDb from "../database/connections";
import * as gameService from "../service/game";
import {RoomEntity} from "../database/types";
import * as roomsDb from "../database/rooms";
import * as broadcast from "./broadcast";
import {GameShipsDto} from "../service/game";

interface CreateGameResponse {
    idGame: number,
    idPlayer: number
}

export const sendCreateGame = (room: RoomEntity) => {
    room.userIds.forEach(userId => {
        const response: CreateGameResponse = {
            idGame: gameService.createGame(),
            idPlayer: userId
        }
        const message = createWsResponse(response, WebSocketMessageTypes.CREATE_GAME)
        connectionsDb.findConnectionById(userId).send(message)
    })
}

const sendStartGame = (gameId: number)=> {
    console.log(gameId) //TODO not implemented
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