import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import {WebSocketServer, WebSocket, RawData} from 'ws';
import {handleRegistration, RegistrationRequest} from "./service/register.js";

export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

const wss = new WebSocketServer({port: 3000});

interface WebsocketMessage {
    type: string,
    data: string,
    id: number,
}

wss.on('connection', (ws: WebSocket) => {
    // Send initial data to the client
    console.log("Connect")
    //ws.send('Welcome to the WebSocket server!');

    // Track connected clients
    // ...
    ws.on('close', () => {
        console.log("Connect close")
        // Code to handle client disconnection
    });
    ws.on('message', (message: RawData) => {
        const request = JSON.parse(message.toString()) as unknown as WebsocketMessage
        console.log('Received message:', request);
        const data = JSON.parse(request.data)

        let response = {}
        if(request.type === "reg") {
            response = handleRegistration(data as unknown as RegistrationRequest)
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
