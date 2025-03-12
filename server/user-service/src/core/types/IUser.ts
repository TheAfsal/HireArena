// user-service/types/IUser.ts

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  status?: boolean;
}
