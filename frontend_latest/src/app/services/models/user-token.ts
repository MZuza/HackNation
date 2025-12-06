export interface UserToken {
    user: {
        session_key: string,
        email: string,
        roles: Array<string>,
        discourse_api_key?: string,
        discourse_user_name?: string
    };
    iat: number;
    exp: number;
    nbf: number;
}
