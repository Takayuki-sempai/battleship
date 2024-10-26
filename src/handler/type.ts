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
    CREATE_ROOM = "create_room"
}