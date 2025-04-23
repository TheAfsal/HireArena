interface Request {
  participants: string[];
  jobId: string;
  companyName: string;
  logo:string;
}

interface Response {
  conversationId: string;
  message: string;
}

export { Request, Response };
