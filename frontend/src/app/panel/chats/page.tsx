

"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { UserList } from "./components/user-list";
import { ChatInterface } from "./components/chat-interface";
import { fetchCompanyChats } from "@/app/api/chat";
import { fetchCandidateProfile } from "@/app/api/profile";

export interface User {
  _id: string;
  fullName: string;
  image: string;
  status: string;
  participants: string[];
  // lastSeen?: Date;
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

export default function ChatApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
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
    const newSocket = io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}`, {
      auth: { token: getAuthToken() },
    });

    setSocket(newSocket);

    const fetchUsers = async () => {
      const response = await fetchCompanyChats();
      setCompanyId(response.companyId);

      setUsers(response.conversations);
      if (response.length > 0) setSelectedUser(response.conversations[0]);
    };
    fetchUsers();

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
    });

    newSocket.on("newMessage", (message: Message) => {
      console.log(message);
      setMessages((prev) => ({
        ...prev,
        [message.conversationId]: [
          ...(prev[message.conversationId] || []),
          message,
        ],
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

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser && socket) {
      const conversationId = selectedUser._id;
      setSelectedConversationId(conversationId);
      socket.emit("joinRoom", conversationId);
      socket.emit("chatHistory", conversationId);
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    async function fetchUserDetails() {
      let updatedUsers = [];

      for (const chat of users) {
        let dummy = chat;
        for (const user of chat.participants) {
          if (user !== companyId) {
            const details = await fetchCandidateProfile(user);
            dummy = { ...dummy, ...details };
          }
        }
        updatedUsers.push(dummy);
      }
      setUsers(updatedUsers);
    }

    fetchUserDetails();
  }, [companyId]);

  const filteredUsers = users.filter(
    (user) =>
      // user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      user.fullName
  );

  const sendMessage = (content: string) => {
    if (!selectedUser || !content.trim() || !socket || !selectedConversationId)
      return;

    const newMessage = {
      roomId: selectedConversationId,
      content,
    };

    socket.emit("messageCompany", newMessage);

    // const tempMessage: Message = {
    //   id: Date.now().toString(),
    //   senderId: companyId,
    //   receiverId: selectedUser._id,
    //   content,
    //   timestamp: new Date().toString(),
    //   status: "sent",
    //   conversationId: selectedConversationId,
    // };
    // setMessages((prev) => ({
    //   ...prev,
    //   [selectedConversationId]: [
    //     ...(prev[selectedConversationId] || []),
    //     tempMessage,
    //   ],
    // }));
  };

  return (
    <div className="flex h-[900px]">
      <div className="flex flex-col w-full h-full md:flex-row">
        <div className="w-full md:w-1/3 border-r border-border">
          <UserList
            companyId={companyId}
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
              companyId={companyId}
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


