export interface RegistrationRequest {
    name: string,
    password: string,
}

export interface RegistrationResponse {
    name: string,
    index: number,
    error: boolean,
    errorText: string,
}

export interface WinnersResponse {
    name: string,
    wins: number
}