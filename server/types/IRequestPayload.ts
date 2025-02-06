// gateway-service/types/IRequestPayload.ts

export interface IRequestPayload {
    endpoint: string;
    method: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    headers?: Record<string, string>;
  }

