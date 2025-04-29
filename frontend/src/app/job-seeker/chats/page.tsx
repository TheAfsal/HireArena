"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ChatInterface } from "./components/chat-interface";
import { fetchMyChats } from "@/app/api/chat";
import UserList from "./components/user-list";

export interface User {
  _id: string;
  companyName: string;
  logo: string;
  status: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  conversationId: string;
}

export interface Notification {
  conversationId: string;
  message: Message;
  senderId: string;
}

export default function ChatApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [notifications, setNotifications] = useState<{ [key: string]: number }>(
    {}
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  useEffect(() => {
    // const newSocket = io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}`, {
    const newSocket = io(`http://localhost:4000`, {
      transports: ["websocket"],
      auth: { token: getAuthToken() },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      socket;
    });

    newSocket.on("connect_error", (error) => {
      console.log("Connection error:", error.message);
    });

    newSocket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
    });

    const fetchUsers = async () => {
      try {
        const response = await fetchMyChats();
        console.log("user chats", response.conversations);
        setMyId(response.userId);
        setUsers(response.conversations);
        // Removed automatic selection of first conversation
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchUsers();

    newSocket.on("newMessage", (message: Message) => {
      setMessages((prev) => ({
        ...prev,
        [message.conversationId]: [
          ...(prev[message.conversationId] || []),
          message,
        ],
      }));
      // Clear notification for this conversation if it's the selected one
      if (message.conversationId === selectedConversationId) {
        setNotifications((prev) => {
          const updated = { ...prev };
          delete updated[message.conversationId];
          return updated;
        });
      }
    });

    newSocket.on("notification", (notification: Notification) => {
      // Ignore notifications for the selected conversation
      if (notification.conversationId === selectedConversationId) return;

      // Update messages state
      setMessages((prev) => ({
        ...prev,
        [notification.conversationId]: [
          ...(prev[notification.conversationId] || []),
          notification.message,
        ],
      }));

      // Increment notification count
      setNotifications((prev) => ({
        ...prev,
        [notification.conversationId]:
          (prev[notification.conversationId] || 0) + 1,
      }));
    });

    newSocket.on("chatHistory", (history: Message[]) => {
      const conversationId =
        history.length > 0 ? history[0].conversationId : selectedConversationId;
      if (conversationId) {
        setMessages((prev) => ({
          ...prev,
          [conversationId]: history,
        }));
        // Clear notifications for this conversation
        setNotifications((prev) => {
          const updated = { ...prev };
          delete updated[conversationId];
          return updated;
        });
      }
    });

    newSocket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedConversationId]);

  useEffect(() => {
    if (selectedUser && socket) {
      // console.log(selectedUser);
      const conversationId = selectedUser._id;
      setSelectedConversationId(conversationId);
      setNotifications((prev) => {
        const updated = { ...prev };
        delete updated[conversationId];
        return updated;
      });
      socket.emit("joinRoom", conversationId);
      socket.emit("chatHistory", conversationId);
    }
  }, [selectedUser, socket]);

  const filteredUsers = users.filter((user) =>
    user.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = (content: string) => {
    if (!selectedUser || !content.trim() || !socket || !selectedConversationId)
      return;

    const newMessage = {
      roomId: selectedConversationId,
      content,
    };

    console.log("****", newMessage);

    socket.emit("message", newMessage);
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
            notifications={notifications}
          />
        </div>
        <div className="flex-1 flex flex-col">
          {selectedUser && selectedConversationId ? (
            <ChatInterface
              userId={myId}
              user={selectedUser}
              messages={messages[selectedConversationId] || []}
              onSendMessage={sendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-content">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  messages: { [key: string]: Message[] };
  notifications: { [key: string]: number };
}
