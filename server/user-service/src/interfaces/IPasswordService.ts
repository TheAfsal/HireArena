export interface IPasswordService {
    /**
     * Hashes a plaintext password.
     * @param password The plaintext password.
     * @returns A promise that resolves with the hashed password.
     */
    hash(password: string): Promise<string>;
  
    /**
     * Compares a plaintext password with a hashed password.
     * @param password The plaintext password.
     * @param hash The hashed password.
     * @returns A promise that resolves with true if the passwords match, otherwise false.
     */
    compare(password: string, hash: string): Promise<boolean>;
  }
  