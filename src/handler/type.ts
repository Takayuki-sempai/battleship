export interface WebsocketMessage {
    type: string,
    data: string,
    id: number,
}

export interface IdHolder {
    id?: number
}

export enum WebSocketMessageTypes {
    REQ = "reg",
    UPDATE_ROOM = "update_room",
    CREATE_ROOM = "create_room",
    ADD_USER_TO_ROOM = "add_user_to_room",
    CREATE_GAME = "create_game",
    ADD_SHIPS = "add_ships",
    START_GAME = "start_game",
    TURN = "turn",
    ATTACK = "attack",
    RANDOM_ATTACK = "randomAttack",
    FINISH = "finish",
    UPDATE_WINNERS = "update_winners",
    DICONNECT = "diconnect",
    SINGLE_PLAY = "single_play"
}

export interface TurnResponse {
    currentPlayer: number
}