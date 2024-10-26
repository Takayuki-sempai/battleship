import {WebSocket} from "ws";

export interface ConnectionDatabase {
    getAllConnections: () => WebSocket[],
    findConnectionById: (userId: number) => WebSocket,
    addConnection: (userId: number, connection: WebSocket) => void
}

export const createConnectionDatabase = (): ConnectionDatabase => {
    const userConnections: Map<number, WebSocket> = new Map();

    const getAllConnections = (): WebSocket[] => Array.from(userConnections.values())

    const findConnectionById = (userId: number): WebSocket => userConnections.get(userId)!! //TODO возможно эксепшен

    const addConnection = (userId: number, connection: WebSocket) => {
        userConnections.set(userId, connection)
    }

    return {
        getAllConnections,
        findConnectionById,
        addConnection
    }
}