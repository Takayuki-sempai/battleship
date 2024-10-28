import {RawData, WebSocket, WebSocketServer} from "ws";
import {handleDisconnect, handleRegistration} from "../handler/user";
import {IdHolder, WebsocketMessage, WebSocketMessageTypes} from "../handler/type";
import {handleAddUserToRoom, handleCreateRoom} from "../handler/room";
import {handleAddShips, handleAttack, handleCreateSinglePlay, handleRandomAttack} from "../handler/game";

export const startWebsocket = (port: number)=> {
    const wss = new WebSocketServer({port});

    wss.on('connection', (ws: WebSocket) => {
        const userIdHolder: IdHolder = {id: undefined}
        console.log("Connect")

        ws.on('close', () => {
            console.log("Connect close")
            if(userIdHolder.id) {
                handleDisconnect(userIdHolder.id)
            }
        });
        ws.on('message', (message: RawData) => {
            const request = JSON.parse(message.toString()) as unknown as WebsocketMessage
            console.log('Received message:', request);

            switch(request.type) {
                case WebSocketMessageTypes.REQ:
                    handleRegistration(ws, userIdHolder, request.data); //TODO не пускать если юзер уже подключен
                    break;
                case WebSocketMessageTypes.CREATE_ROOM:
                    handleCreateRoom(userIdHolder);
                    break;
                case WebSocketMessageTypes.ADD_USER_TO_ROOM:
                    handleAddUserToRoom(userIdHolder, request.data); //TODO Не заходить в свою комнату. Не пускать в другую комнату, если игрок в комнате
                    break;
                case WebSocketMessageTypes.ADD_SHIPS:
                    handleAddShips(ws, userIdHolder, request.data);
                    break;
                case WebSocketMessageTypes.ATTACK:
                    handleAttack(request.data); //TODO Что если атаку посылает игрок который сейчас не ходит (написать проверку)
                    break;
                case WebSocketMessageTypes.RANDOM_ATTACK:
                    handleRandomAttack(request.data);
                    break;
                case WebSocketMessageTypes.SINGLE_PLAY:
                    handleCreateSinglePlay(userIdHolder, );
                    break;
                default: console.log(`Handler for message with type ${request.type} not found`);
            }
        });
    });
}