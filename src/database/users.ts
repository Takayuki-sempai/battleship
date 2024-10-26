import {UserEntity, UserCreateRequest} from "./types";
import {IdGenerator} from "../utils/utils";

const users: Map<number, UserEntity> = new Map();
const idGenerator = IdGenerator()

export const findUser = (userId: number): UserEntity | undefined => {
    return users.get(userId);
};

export const findUserByName = (username: string): UserEntity | undefined => {
    return Array.from(users.values()).find((user) => user.name === username);
};

export const createUser = (userRequest: UserCreateRequest): UserEntity => {
    const id = idGenerator.getNextId()
    const user = {...userRequest, id}
    users.set(id, user);
    return user;
};