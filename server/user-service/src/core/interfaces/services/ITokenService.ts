export interface ITokenService {
  generateVerificationToken(userId: string): string;
  verifyVerificationToken(token: string): string;
  generateAccessToken(userId: string, role?: string): string;
  generateRefreshToken(userId: string, role: string): string;
  verifyRefreshToken(token: string): string;
  verifyAccessToken(token: string): string;
  generate(): string;
  encrypt(text: string, secretKey: string): string;
  decrypt(encryptedText: string, secretKey: string): string;
}
