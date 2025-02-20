"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class TokenService {
    generateVerificationToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, process.env.VERIFICATION_TOKEN_SECRET || "", {
            expiresIn: "1d",
        });
    }
    verifyVerificationToken(token) {
        const payload = jsonwebtoken_1.default.verify(token, process.env.VERIFICATION_TOKEN_SECRET || "");
        return payload.userId;
    }
    generateAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || "", {
            expiresIn: "1m", // 1 minutes
        });
    }
    generateRefreshToken(userId, role) {
        return jsonwebtoken_1.default.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET || "", {
            expiresIn: "7d", // 7 days
        });
    }
    verifyRefreshToken(token) {
        const payload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET || "");
        return payload.userId;
    }
    generate() {
        return crypto_1.default.randomBytes(20).toString("hex");
    }
    encrypt(text, secretKey) {
        // Ensure the secretKey is 32 bytes long (AES-256-CBC requires a 32-byte key)
        const key = crypto_1.default.createHash('sha256').update(secretKey).digest(); // Hash the key to 32 bytes
        const iv = crypto_1.default.randomBytes(16); // Generate a random 16-byte IV
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Return both the IV and the encrypted text
        return iv.toString('hex') + ':' + encrypted;
    }
    decrypt(encryptedText, secretKey) {
        const key = crypto_1.default.createHash('sha256').update(secretKey).digest();
        const [ivHex, encrypted] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
exports.default = TokenService;
