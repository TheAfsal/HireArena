
export const TYPES ={
    // Controller
    ChatController: Symbol.for('ChatController'),
    
    // Service
    ChatService: Symbol.for('ChatService'),
    
    // Repository
    MessageRepository: Symbol.for('MessageRepository'),
    ConversationRepository: Symbol.for('ConversationRepository'),

    SocketIOServer: Symbol.for('SocketIOServer'),   
}