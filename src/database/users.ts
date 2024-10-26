import {User, UserCreateRequest} from "./types";

export const UsersDatabase = () => {
    const users: Map<number, User> = new Map();
    let currentUserId = 0;

    const getNextUserId = () => currentUserId++

    const findUser = (userId: number): User | undefined => {
        return users.get(userId);
    };

    const findUserByName = (username: string): User | undefined => {
        return Array.from(users.values()).find((user) => user.name === username);
    };

    const createUser = (userRequest: UserCreateRequest): User => {
        const id = getNextUserId()
        const user = {...userRequest, id}
        users.set(id, user);
        return user;
    };

    return {
        findUser,
        findUserByName,
        createUser,
    };
};