
export const TYPES ={
    // Controller
    ChatController: Symbol.for('ChatController'),
    
    // Service
    ChatService: Symbol.for('ChatService'),
    
    // Repository
    MessageRepository: Symbol.for('MessageRepository'),
    ConversationRepository: Symbol.for('ConversationRepository'),
    UserConversationsRepository: Symbol.for("UserConversationsRepository"),

    // SocketIOServer: Symbol.for('SocketIOServer'),   
    SocketManager: Symbol.for("SocketManager"),
    PeerServer: Symbol.for("PeerServer"),
}