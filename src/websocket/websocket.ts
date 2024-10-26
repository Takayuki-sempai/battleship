import {RawData, WebSocket, WebSocketServer} from "ws";
import {createUserHandlers} from "../handler/user";
import {IdHolder, WebSocketMessageTypes} from "../handler/type";
import {createRoomHandlers} from "../handler/room";
import {createUserDatabase} from "../database/users";
import {createRoomDatabase} from "../database/rooms";
import {createConnectionDatabase} from "../database/connectedUsers";
import {createBroadcastHandlers} from "../handler/broadcast";
import {createGameHandlers} from "../handler/game";

interface WebsocketMessage {
    type: string,
    data: string,
    id: number,
}

export const startWebsocket = (port: number) => {
    const userDb = createUserDatabase()
    const roomDb = createRoomDatabase()
    const connectionDb = createConnectionDatabase()
    const broadcastHandlers = createBroadcastHandlers(userDb, roomDb, connectionDb)
    const userHandlers = createUserHandlers(userDb, connectionDb, broadcastHandlers)
    const gameHandlers = createGameHandlers(connectionDb)
    const roomHandlers = createRoomHandlers(roomDb, broadcastHandlers, gameHandlers)

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
                    userHandlers.handleRegistration(ws, idHolder, request.data);
                    break;
                case WebSocketMessageTypes.CREATE_ROOM:
                    roomHandlers.handleCreateRoom(idHolder);
                    break;
                case WebSocketMessageTypes.ADD_USER_TO_ROOM:
                    roomHandlers.handleAddUserToRoom(idHolder, request.data);
                    break;
                default: console.log(`Handler for message with type ${request.type} not found`);
            }
        });
    });
}