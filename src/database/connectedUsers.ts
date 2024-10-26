import {WebSocket} from "ws";

const userConnections: Map<number, WebSocket> = new Map();

export const getAllConnections = (): WebSocket[] => {
    return Array.from(userConnections.values())
}

export const addConnection = (userId: number, connection: WebSocket) => {
    return userConnections.set(userId, connection)
};