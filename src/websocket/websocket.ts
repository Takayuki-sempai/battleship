import {RawData, WebSocket, WebSocketServer} from "ws";
import {handleRegistration} from "../handler/register";
import {IdHolder, WebsocketMessage, WebSocketMessageTypes} from "../handler/type";

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

            let response = {}
            if (request.type === WebSocketMessageTypes.REQ) {
                handleRegistration(ws, idHolder, request.data)
            }

            const messageResponse = {
                type: request.type,
                data: JSON.stringify(response),
                id: request.id,
            }
            ws.send(JSON.stringify(messageResponse));

            const roomUpdate = {
                type: "update_room",
                data: JSON.stringify(
                    [
                        {
                            roomId: 1,
                            roomUsers:
                                [
                                    {
                                        name: "Test user",
                                        index: 42,
                                    }
                                ],
                        },
                    ]),
                id: 0,
            }
            ws.send(JSON.stringify(roomUpdate));
        });
    });
}