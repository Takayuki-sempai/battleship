import {createWsResponse} from "./common";
import {WebSocketMessageTypes} from "./type";
import * as connectionsDb from "../database/connections";
import {RoomEntity} from "../database/types";

interface CreateGameResponse {
    idGame: number,
    idPlayer: number
}

export const sendCreateGame = (room: RoomEntity) => {
    room.userIds.forEach(userId => {
        const response: CreateGameResponse = {
            idGame: room.id,
            idPlayer: userId
        }
        const message = createWsResponse(response, WebSocketMessageTypes.CREATE_GAME)
        connectionsDb.findConnectionById(userId).send(message)
    })
}