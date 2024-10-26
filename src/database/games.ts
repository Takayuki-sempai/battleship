import {GameEntity} from "./types";
import {IdGenerator} from "../utils/utils";

const games: Map<number, GameEntity> = new Map();
const idGenerator = IdGenerator()

export const findGame = (gameId: number): GameEntity | undefined => {
    return games.get(gameId);
};

export const createGame = (game: GameEntity): number => {
    const id = idGenerator.getNextId()
    games.set(id, game);
    return id
};