export interface IdHolder {
    id?: number
}

export enum WebSocketMessageTypes {
    REQ = "reg",
    UPDATE_ROOM = "update_room",
    CREATE_ROOM = "create_room",
    ADD_USER_TO_ROOM = "add_user_to_room"
}