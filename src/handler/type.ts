interface WebsocketMessage {
    type: string,
    data: string,
    id: number,
}

interface IdHolder {
    id?: number
}

enum WebSocketMessageTypes {
    REQ = "reg",
    UPDATE_ROOM = "update_room"
}