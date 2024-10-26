import {createWsResponse} from "./common";
import {WebSocketMessageTypes} from "./type";
import {ConnectionDatabase} from "../database/connectedUsers";
import {RoomEntity} from "../database/types";

interface CreateGameResponse {
    idGame: number,
    idPlayer: number
}

export interface GameHandlers {
    sendCreateGame: (room: RoomEntity) => void
}

export const createGameHandlers = (connectionDb: ConnectionDatabase, ): GameHandlers => {
    const sendCreateGame = (room: RoomEntity) => {
        room.userIds.forEach(userId => {
            const response: CreateGameResponse = {
                idGame: room.id,
                idPlayer: userId
            }
            const message = createWsResponse(response, WebSocketMessageTypes.CREATE_GAME)
            connectionDb.findConnectionById(userId).send(message)
        })
    }

    return {
        sendCreateGame,
    }
}