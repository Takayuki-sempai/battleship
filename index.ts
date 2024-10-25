import { httpServer } from "./src/http_server/index.js";
import "./src/websocket/websocket.js";
import {startWebsocket} from "./src/websocket/websocket";

const HTTP_PORT = 8181;
const WEB_SOCKET_PORT = 3000

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
startWebsocket(WEB_SOCKET_PORT);
console.log(`Start websocket on the ${WEB_SOCKET_PORT} port!`);