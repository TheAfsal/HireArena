interface Request {
  participants: string[];
  jobId: string;
}

interface Response {
  conversationId: string;
  message: string;
}

export { Request, Response } 
