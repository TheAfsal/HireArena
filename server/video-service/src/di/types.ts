
export const TYPES ={
    // Controller
    VideoController: Symbol.for('VideoController'),
    
    // Service
    VideoService: Symbol.for('VideoService'),
    
    // Repository
    MessageRepository: Symbol.for('MessageRepository'),
    ConversationRepository: Symbol.for('ConversationRepository'),
    UserConversationsRepository: Symbol.for("UserConversationsRepository"),

    // VideoService
    VideoCallService: Symbol.for("VideoCallService"),
    VideoCallRepository: Symbol.for("VideoCallRepository"),
    

    // SocketIOServer: Symbol.for('SocketIOServer'),   
    SocketManager: Symbol.for("SocketManager"),
    PeerServer: Symbol.for("PeerServer"),
}
