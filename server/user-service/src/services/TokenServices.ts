import jwt from "jsonwebtoken";
import { ITokenService } from "../interfaces/ITokenService";
import crypto from "crypto";

class TokenService implements ITokenService {
  generateVerificationToken(userId: string): string {
    return jwt.sign({ userId }, process.env.VERIFICATION_TOKEN_SECRET || "", {
      expiresIn: "1d",
    });
  }

  verifyVerificationToken(token: string): string {
    const payload = jwt.verify(
      token,
      process.env.VERIFICATION_TOKEN_SECRET || ""
    ) as jwt.JwtPayload;
    return payload.userId;
  }

  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || "", {
      expiresIn: "15m",
    });
  }

  generateRefreshToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET || "", {
      expiresIn: "7d",
    });
  }

  verifyAccessToken(token: string): string {
      const payload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || ""
      ) as jwt.JwtPayload;
      return payload.userId;
  }

  verifyRefreshToken(token: string): string {
    const payload = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || ""
    ) as jwt.JwtPayload;
    return payload.userId;
  }

  generate(): string {
    return crypto.randomBytes(20).toString("hex");
  }

  encrypt(text: string, secretKey: string): string {
    // Ensure the secretKey is 32 bytes long (AES-256-CBC requires a 32-byte key)
    const key = crypto.createHash("sha256").update(secretKey).digest(); // Hash the key to 32 bytes
    const iv = crypto.randomBytes(16); // Generate a random 16-byte IV

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Return both the IV and the encrypted text
    return iv.toString("hex") + ":" + encrypted;
  }

  decrypt(encryptedText: string, secretKey: string): string {
    const key = crypto.createHash("sha256").update(secretKey).digest();

    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}

export default TokenService;
