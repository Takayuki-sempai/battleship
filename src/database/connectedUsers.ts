import {WebSocket} from "ws";

const userConnections: Map<number, WebSocket> = new Map();

export const getAllConnections = (): WebSocket[] => Array.from(userConnections.values())

export const findConnectionById = (userId: number): WebSocket => userConnections.get(userId)!! //TODO возможно эксепшен

export const addConnection = (userId: number, connection: WebSocket) => {
    userConnections.set(userId, connection)
};