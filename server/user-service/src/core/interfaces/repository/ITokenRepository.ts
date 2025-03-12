export interface ITokenRepository {
  storeRefreshToken(email: string, refreshToken: string): Promise<void>;
  getRefreshToken(email: string): Promise<string | null>;
  removeRefreshToken(email: string): Promise<void>;
}
