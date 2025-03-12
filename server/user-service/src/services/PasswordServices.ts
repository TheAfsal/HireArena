import bcrypt from "bcryptjs";
import { IPasswordService } from "@core/interfaces/services/IPasswordService";

class PasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export default PasswordService;
