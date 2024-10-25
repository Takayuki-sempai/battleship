export interface UserCreateRequest {
    name: string,
    password: string
}

export interface User {
    id: number;
    name: string,
    password: string
}