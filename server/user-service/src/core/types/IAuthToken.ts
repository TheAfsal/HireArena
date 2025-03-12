export interface IAuthToken {
    userId: number;
    role: string;
    exp: number; // expiration timestamp
    iat: number; // issued at timestamp
}
