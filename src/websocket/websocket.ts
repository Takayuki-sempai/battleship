import {RawData, WebSocket, WebSocketServer} from "ws";
import {handleRegistration} from "../handler/register";
import {IdHolder, WebsocketMessage, WebSocketMessageTypes} from "../handler/type";
import {handleCreateRoom} from "../handler/room";

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
                    handleCreateRoom(ws, idHolder);
                    break;
                default: console.log(`Handler for message with type ${request.type} not found`);
            }
        });
    });
}