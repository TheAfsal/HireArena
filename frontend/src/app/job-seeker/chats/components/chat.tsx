"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ChatInterface } from "./chat-interface";
import { fetchMyChats, fetchCompanyChats } from "@/app/api/chat";
import { fetchCandidateProfile } from "@/app/api/profile";
import { UserList } from "./user-list";

export interface User {
  _id: string;
  name: string;
  image: string;
  status: string;
  participants?: string[];
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

export default function ChatApp({ userType }: { userType: "job-seeker" | "company" }) {
  const [users, setUsers] = useState<User[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [notifications, setNotifications] = useState<{ [key: string]: number }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_GATEWAY_URL}`, {
      transports: ["websocket"],
      auth: { token: getAuthToken() },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
      // Fetch statuses for all conversations on connect
      if (selectedConversationId) {
        newSocket.emit("getMessageStatuses", selectedConversationId);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.log("Connection error:", error.message);
    });

    newSocket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnection attempt ${attempt}`);
    });

    const fetchUsers = async () => {
      try {
        //@ts-ignore
        let response;
        if (userType === "job-seeker") {
          response = await fetchMyChats();
          setMyId(response.userId);
          setUsers(
            response.conversations.map((conv: any) => ({
              _id: conv._id,
              name: conv.companyName,
              image: conv.logo,
              status: conv.status,
            }))
          );
        } else {
          response = await fetchCompanyChats();
          setMyId(response.companyId);
          const conversations = await Promise.all(
            response.conversations.map(async (conv: any) => {
              for (const userId of conv.participants) {
                //@ts-ignore
                if (userId !== response.companyId) {
                  const profile = await fetchCandidateProfile(userId);
                  return {
                    _id: conv._id,
                    name: profile.fullName,
                    image: profile.image,
                    status: conv.status,
                    participants: conv.participants,
                  };
                }
              }
              return null;
            })
          );
          setUsers(conversations.filter((conv): conv is User => conv !== null));
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchUsers();

    newSocket.on("newMessage", (message: Message) => {
      setMessages((prev) => {
        const updated = { ...prev };
        updated[message.conversationId] = [
          ...(updated[message.conversationId] || []),
          message,
        ];
        return updated;
      });
      if (message.conversationId === selectedConversationId) {
        setNotifications((prev) => {
          const updated = { ...prev };
          delete updated[message.conversationId];
          return updated;
        });
      }
    });

    newSocket.on("notification", (notification: Notification) => {
      if (notification.conversationId === selectedConversationId) return;

      setMessages((prev) => {
        const updated = { ...prev };
        updated[notification.conversationId] = [
          ...(updated[notification.conversationId] || []),
          notification.message,
        ];
        return updated;
      });

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
        setNotifications((prev) => {
          const updated = { ...prev };
          delete updated[conversationId];
          return updated;
        });
      }
    });

    newSocket.on("messageStatuses", ({ conversationId, messages }: { conversationId: string; messages: Message[] }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (updated[conversationId]) {
          updated[conversationId] = updated[conversationId].map((msg) => {
            const updatedMsg = messages.find((m) => m.id === msg.id);
            return updatedMsg ? { ...msg, status: updatedMsg.status } : msg;
          });
        }
        return updated;
      });
    });

    newSocket.on("typing", ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      if (conversationId === selectedConversationId) {
        setTypingUsers((prev) => ({ ...prev, [userId]: true }));
      }
    });

    newSocket.on("stopTyping", ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      if (conversationId === selectedConversationId) {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    });

    newSocket.on("messageDelivered", ({ conversationId, messageIds }: { conversationId: string; messageIds: string[] }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (updated[conversationId]) {
          updated[conversationId] = updated[conversationId].map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, status: "delivered" } : msg
          );
        }
        return updated;
      });
    });

    newSocket.on("messageRead", ({ conversationId, messageIds }: { conversationId: string; messageIds: string[] }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (updated[conversationId]) {
          updated[conversationId] = updated[conversationId].map((msg) =>
            messageIds.includes(msg.id) ? { ...msg, status: "read" } : msg
          );
        }
        return updated;
      });
    });

    newSocket.on("error", (error: string) => {
      console.error("Socket error:", error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [selectedConversationId, userType]);

  useEffect(() => {
    if (selectedUser && socket) {
      const conversationId = selectedUser._id;
      setSelectedConversationId(conversationId);
      setNotifications((prev) => {
        const updated = { ...prev };
        delete updated[conversationId];
        return updated;
      });
      socket.emit("joinRoom", conversationId);
      socket.emit("chatHistory", conversationId);
      socket.emit("getMessageStatuses", conversationId);
      socket.emit("markMessagesRead", { conversationId, userId: myId });
    }
  }, [selectedUser, socket, myId]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = (content: string) => {
    if (!selectedUser || !content.trim() || !socket || !selectedConversationId)
      return;

    const newMessage = {
      roomId: selectedConversationId,
      content,
    };

    socket.emit(userType === "company" ? "messageCompany" : "message", newMessage);
    setIsTyping(false);
    socket.emit("stopTyping", { conversationId: selectedConversationId, userId: myId });
  };

  const handleTyping = () => {
    if (socket && selectedConversationId && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", { conversationId: selectedConversationId, userId: myId });
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stopTyping", { conversationId: selectedConversationId, userId: myId });
      }, 3000);
    }
  };

  return (
    <div className="flex h-full bg-background">
      <div className="flex flex-col w-full h-full md:flex-row">
        <div className="w-full md:w-1/3 border-r border-border">
          <UserList
            myId={myId}
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            messages={messages}
            notifications={notifications}
            userType={userType}
          />
        </div>
        <div className="flex-1 flex flex-col">
          {selectedUser && selectedConversationId ? (
            <ChatInterface
              myId={myId}
              user={selectedUser}
              messages={messages[selectedConversationId] || []}
              onSendMessage={sendMessage}
              onTyping={handleTyping}
              typingUsers={typingUsers}
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
  myId: string;
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  messages: { [key: string]: Message[] };
  notifications: { [key: string]: number };
  userType: "job-seeker" | "company";
}