import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import {WebSocketServer, WebSocket, RawData} from 'ws';

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

const wss = new WebSocketServer({ port: 3000 });

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
    // Handle incoming messages
    console.log('Received message:', message.toString());

    // Send a response to the client
    ws.send('Message received successfully!');
});
});
