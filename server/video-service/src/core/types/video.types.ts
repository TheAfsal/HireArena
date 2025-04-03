export interface IVideoCall {
  id: string;
  conversationId: string;
  participants: string[];
  startedAt: Date;
}