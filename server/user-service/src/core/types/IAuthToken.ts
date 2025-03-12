export interface IAuthToken {
    userId: number;
    role: string;
    exp: number; 
    iat: number; 
}
