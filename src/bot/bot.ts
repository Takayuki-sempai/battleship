import * as gameHandler from "../handler/game";
import * as gameService from "../service/game";
import {IdGenerator} from "../utils/utils";
import {IdHolder, TurnResponse, WebsocketMessage, WebSocketMessageTypes} from "../handler/type";
import {GameSocket} from "../database/types";
import * as connectionsDb from "../database/connections";
import {GameRandomAttackRequest} from "../service/gameTypes";

const botIdGenerator = IdGenerator(100_000)

export const addBotToGame = (gameId: number) => {
    const botIdHolder: IdHolder = {id: botIdGenerator.getNextId()}
    const addShipsRequest = '{"gameId":1,"ships":[' +
        '{"position":{"x":0,"y":0},"direction":false,"type":"huge","length":4},' +
        '{"position":{"x":0,"y":9},"direction":false,"type":"large","length":3},' +
        '{"position":{"x":5,"y":4},"direction":false,"type":"large","length":3},' +
        '{"position":{"x":4,"y":6},"direction":true,"type":"medium","length":2},' +
        '{"position":{"x":8,"y":0},"direction":true,"type":"medium","length":2},' +
        '{"position":{"x":5,"y":0},"direction":true,"type":"medium","length":2},' +
        '{"position":{"x":4,"y":9},"direction":true,"type":"small","length":1},' +
        '{"position":{"x":0,"y":4},"direction":false,"type":"small","length":1},' +
        '{"position":{"x":3,"y":2},"direction":true,"type":"small","length":1},' +
        '{"position":{"x":3,"y":4},"direction":true,"type":"small","length":1}],' +
        '"indexPlayer":1}'

    const onMessage = (message: string ) => {
        const request = JSON.parse(message.toString()) as unknown as WebsocketMessage
        if(request.type == WebSocketMessageTypes.TURN) {
            const data = JSON.parse(request.data.toString()) as unknown as TurnResponse
            if(data.currentPlayer == botIdHolder.id!!) {
                const randomAttack: GameRandomAttackRequest = {
                    gameId: gameId,
                    indexPlayer: botIdHolder.id!
                }
                gameHandler.handleRandomAttack(JSON.stringify(randomAttack))
            }
        }
    }
    const fakeConnection: GameSocket = {send: onMessage};
    connectionsDb.addConnection(botIdHolder.id!!, fakeConnection)
    gameHandler.handleAddShips(fakeConnection, botIdHolder, addShipsRequest)
    gameService.changeCurrentPlayer(gameId)
}