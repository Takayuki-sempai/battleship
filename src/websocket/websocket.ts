import {RawData, WebSocket, WebSocketServer} from "ws";
import {handleRegistration} from "../handler/users";
import {IdHolder, WebSocketMessageTypes} from "../handler/type";
import {handleAddUserToRoom, handleCreateRoom} from "../handler/room";
import {handleAddShips, handleAttack} from "../handler/game";

interface WebsocketMessage {
    type: string,
    data: string,
    id: number,
}

export const startWebsocket = (port: number)=> {
    const wss = new WebSocketServer({port});

    wss.on('connection', (ws: WebSocket) => {
        const idHolder: IdHolder = {id: undefined}
        // Send initial data to the client
        console.log("Connect")

        // Track connected clients
        // ...
        ws.on('close', () => {
            console.log("Connect close")
            // Code to handle client disconnection
        });
        ws.on('message', (message: RawData) => {
            const request = JSON.parse(message.toString()) as unknown as WebsocketMessage
            console.log('Received message:', request);

            switch(request.type) {
                case WebSocketMessageTypes.REQ:
                    handleRegistration(ws, idHolder, request.data);
                    break;
                case WebSocketMessageTypes.CREATE_ROOM:
                    handleCreateRoom(idHolder);
                    break;
                case WebSocketMessageTypes.ADD_USER_TO_ROOM:
                    handleAddUserToRoom(idHolder, request.data);
                    break;
                case WebSocketMessageTypes.ADD_SHIPS:
                    handleAddShips(idHolder, request.data);
                    break;
                case WebSocketMessageTypes.ATTACK:
                    handleAttack(request.data); //TODO Что если атаку посылает игрок который сейчас не ходит (написать проверку)
                    break;
                default: console.log(`Handler for message with type ${request.type} not found`);
            }
        });
    });
}