

export interface IRedisService {
    get(key: string): Promise<string | null>;
    setWithTTL(key: string, value: any, ttl: number): Promise<void>;
    delete(key: string): Promise<void>;
  }
