import {User, UserCreateRequest} from "./types";
import {IdGenerator} from "../utils/utils";

const users: Map<number, User> = new Map();
const idGenerator = IdGenerator()

export const findUser = (userId: number): User | undefined => {
    return users.get(userId);
};

export const findUserByName = (username: string): User | undefined => {
    return Array.from(users.values()).find((user) => user.name === username);
};

export const createUser = (userRequest: UserCreateRequest): User => {
    const id = idGenerator.getNextId()
    const user = {...userRequest, id}
    users.set(id, user);
    return user;
};