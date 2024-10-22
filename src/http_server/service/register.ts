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

export const handleRegistration = (request: RegistrationRequest): RegistrationResponse => {
    return {
        name: request.name,
        index: 0,
        error: false,
        errorText: "",
    }
}