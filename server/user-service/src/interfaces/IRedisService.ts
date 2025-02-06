/**
 * Interface representing the operations available for Redis interaction.
 */
export interface IRedisService {
  /**
   * Retrieves a value from Redis by key.
   * @param key The key to look up in Redis.
   * @returns A promise that resolves with the value or null if not found.
   */
  get(key: string): Promise<string | null>;

  /**
   * Stores a value in Redis with a specified TTL (time-to-live).
   * @param key The key to store the value under.
   * @param value The value to store (will be stringified).
   * @param ttl Time-to-live in seconds (how long the key-value pair should remain in Redis).
   * @returns A promise that resolves when the operation is complete.
   */
  setWithTTL(key: string, value: any, ttl: number): Promise<void>;

  /**
   * Deletes a value from Redis by key.
   * @param key The key to delete.
   * @returns A promise that resolves when the operation is complete.
   */
  delete(key: string): Promise<void>;

}
