import {GameSocket} from "./types";

const userConnections: Map<number, GameSocket> = new Map();

export const getAllConnections = (): GameSocket[] => Array.from(userConnections.values())

export const findConnectionById = (userId: number): GameSocket => userConnections.get(userId)!! //TODO возможно эксепшен

export const addConnection = (userId: number, connection: GameSocket) => {
    userConnections.set(userId, connection)
};

export const removeConnection = (userId: number) => {
    userConnections.delete(userId)
};