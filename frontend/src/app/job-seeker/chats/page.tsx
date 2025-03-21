"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { UserList } from "./components/user-list";
import { ChatInterface } from "./components/chat-interface";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  conversationId: string; 
}

export default function ChatApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const getAuthToken = () => "your-jwt-token-here"; 

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}`, {
      auth: { token: getAuthToken() },
    });

    setSocket(newSocket);7

    // Fetch users from user-service (mocked here for simplicity)
    const fetchUsers = async () => {
      // Replace with actual API call to user-service
      const mockUsers: User[] = [
        { id: "user1", name: "Company A", avatar: "", status: "online" },
        { id: "user2", name: "Job Seeker B", avatar: "", status: "offline" },
      ];
      setUsers(mockUsers);
      if (mockUsers.length > 0) setSelectedUser(mockUsers[0]);
    };
    fetchUsers();

    // Socket.IO event handlers
    newSocket.on("connect", () => {
      console.log("Connected to chat server");
    });

    newSocket.on("newMessage", (message: Message) => {
      setMessages((prev) => ({
        ...prev,
        [message.conversationId]: [...(prev[message.conversationId] || []), message],
      }));
    });

    newSocket.on("chatHistory", (history: Message[]) => {
      if (history.length > 0) {
        const conversationId = history[0].conversationId;
        setMessages((prev) => ({
          ...prev,
          [conversationId]: history,
        }));
      }
    });

    newSocket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch chat history when selecting a user
  useEffect(() => {
    if (selectedUser && socket) {
      // Replace with actual conversation ID from job-service or chat-service
      const conversationId = `${selectedUser.id}-currentUser`; // Temporary; fetch real ID
      setSelectedConversationId(conversationId);
      socket.emit("joinRoom", conversationId);
      socket.emit("chatHistory", conversationId);
    }
  }, [selectedUser, socket]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = (content: string) => {
    if (!selectedUser || !content.trim() || !socket || !selectedConversationId) return;

    const newMessage = {
      roomId: selectedConversationId,
      content,
      senderId: "currentUser", 
    };

    socket.emit("message", newMessage);

    const tempMessage: Message = {
      id: Date.now().toString(),
      senderId: "currentUser",
      receiverId: selectedUser.id,
      content,
      timestamp: new Date(),
      status: "sent",
      conversationId: selectedConversationId,
    };
    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), tempMessage],
    }));
  };

  return (
    <div className="flex h-full bg-background">
      <div className="flex flex-col w-full h-full md:flex-row">
        <div className="w-full md:w-1/3 border-r border-border">
          <UserList
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            messages={messages}
          />
        </div>
        <div className="flex-1 flex flex-col">
          {selectedUser && selectedConversationId ? (
            <ChatInterface
              user={selectedUser}
              messages={messages[selectedConversationId] || []}
              onSendMessage={sendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-content">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}