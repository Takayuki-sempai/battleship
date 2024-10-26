import {UserEntity, UserCreateRequest} from "./types";
import {IdGenerator} from "../utils/utils";

export interface UserDatabase {
    findUser: (userId: number) => UserEntity | undefined,
    findUserByName: (username: string) => UserEntity | undefined,
    createUser: (user: UserCreateRequest) => UserEntity,
}

export const createUserDatabase = (): UserDatabase => {
    const users: Map<number, UserEntity> = new Map();
    const idGenerator = IdGenerator()

    const findUser = (userId: number): UserEntity | undefined => {
        return users.get(userId);
    }

    const findUserByName = (username: string): UserEntity | undefined => {
        return Array.from(users.values()).find((user) => user.name === username);
    }

    const createUser = (userRequest: UserCreateRequest): UserEntity => {
        const id = idGenerator.getNextId()
        const user = {...userRequest, id}
        users.set(id, user);
        return user;
    }

    return {
        findUser,
        findUserByName,
        createUser,
    }
}