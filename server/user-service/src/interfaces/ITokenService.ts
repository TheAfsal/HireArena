export interface ITokenService {
  generateVerificationToken(userId: string): string;
  verifyVerificationToken(token: string): string;
  generateAccessToken(userId: string): string;
  generateRefreshToken(userId: string): string;
  generate(): string;
  encrypt(text: string, secretKey: string): string;
  decrypt(encryptedText: string, secretKey: string): string;
}
