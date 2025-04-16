"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ChatInterface } from "./components/chat-interface";
import { fetchMyChats } from "@/app/api/chat";

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
  const [notifications, setNotifications] = useState<{ [key: string]: number }>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  useEffect(() => {
    console.log("@@ chat");

    const newSocket = io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}`, {
      auth: { token: getAuthToken() },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chat server");
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
        [notification.conversationId]: (prev[notification.conversationId] || 0) + 1,
      }));
    });

    newSocket.on("chatHistory", (history: Message[]) => {
      const conversationId = history.length > 0 ? history[0].conversationId : selectedConversationId;
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
      console.log(selectedUser);
      const conversationId = selectedUser._id;
      setSelectedConversationId(conversationId);
      // Clear notifications when opening a conversation
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

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  messages: { [key: string]: Message[] };
  notifications: { [key: string]: number };
}

export function UserList({
  users,
  selectedUser,
  onSelectUser,
  searchQuery,
  onSearchChange,
  messages,
  notifications,
}: UserListProps) {
  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-2 m-2 border rounded"
      />
      <ul className="overflow-auto">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`p-4 cursor-pointer flex justify-between items-center ${
              selectedUser?._id === user._id ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
          >
            <div>
              <p className="font-semibold">{user.companyName}</p>
              <p className="text-sm text-gray-500">
                {messages[user._id]?.slice(-1)[0]?.content || "No messages yet"}
              </p>
            </div>
            {notifications[user._id] ? (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {notifications[user._id]}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import { io, Socket } from "socket.io-client";
// import { UserList } from "./components/user-list";
// import { ChatInterface } from "./components/chat-interface";
// import { fetchMyChats } from "@/app/api/chat";

// export interface User {
//   _id: string;
//   companyName: string;
//   logo: string;
//   status: string;
// }

// export interface Message {
//   id: string;
//   senderId: string;
//   receiverId: string;
//   content: string;
//   timestamp: string;
//   status: "sent" | "delivered" | "read";
//   conversationId: string;
// }

// export default function ChatApp() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [myId, setMyId] = useState<string>("");
//   const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [socket, setSocket] = useState<Socket | null>(null);

//   const getAuthToken = () => {
//     return localStorage.getItem("authToken");
//   };

//   useEffect(() => {
//     console.log("@@ chat");

//     const newSocket = io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL}`, {
//       auth: { token: getAuthToken() },
//     });

//     setSocket(newSocket);

//     newSocket.on("connect", () => {
//       console.log("Connected to chat server");
//     });

//     const fetchUsers = async () => {
//       const response = await fetchMyChats();
//       console.log("user chats", response.conversations);
//       setMyId(response.userId);
//       setUsers(response.conversations);

//       // Join all conversation rooms
//       response.conversations.forEach((conversation: User) => {
//         newSocket.emit("joinRoom", conversation._id);
//         newSocket.emit("chatHistory", conversation._id); // Optionally fetch history for all conversations
//       });

//       if (response.conversations.length > 0) {
//         setSelectedUser(response.conversations[0]);
//       }
//     };
//     fetchUsers();

//     newSocket.on("newMessage", (message: Message) => {
//       setMessages((prev) => ({
//         ...prev,
//         [message.conversationId]: [
//           ...(prev[message.conversationId] || []),
//           message,
//         ],
//       }));
//     });

//     newSocket.on("chatHistory", (history: Message[]) => {
//       if (history.length > 0) {
//         console.log(history);
//         const conversationId = history[0].conversationId;
//         setMessages((prev) => ({
//           ...prev,
//           [conversationId]: history,
//         }));
//       }
//     });

//     newSocket.on("error", (error: string) => {
//       console.error("Socket error:", error);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (selectedUser && socket) {
//       console.log(selectedUser);
//       const conversationId = selectedUser._id;
//       setSelectedConversationId(conversationId);
//       // No need to join room here since we joined all rooms on load
//       socket.emit("chatHistory", conversationId); // Fetch history when selecting a user
//     }
//   }, [selectedUser, socket]);

//   const filteredUsers = users.filter((user) =>
//     user.companyName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const sendMessage = (content: string) => {
//     if (!selectedUser || !content.trim() || !socket || !selectedConversationId)
//       return;

//     const newMessage = {
//       roomId: selectedConversationId,
//       content,
//     };

//     socket.emit("message", newMessage);
//   };

//   return (
//     <div className="flex h-full bg-background">
//       <div className="flex flex-col w-full h-full md:flex-row">
//         <div className="w-full md:w-1/3 border-r border-border">
//           <UserList
//             users={filteredUsers}
//             selectedUser={selectedUser}
//             onSelectUser={setSelectedUser}
//             searchQuery={searchQuery}
//             onSearchChange={setSearchQuery}
//             messages={messages}
//           />
//         </div>
//         <div className="flex-1 flex flex-col">
//           {selectedUser && selectedConversationId ? (
//             <ChatInterface
//               userId={myId}
//               user={selectedUser}
//               messages={messages[selectedConversationId] || []}
//               onSendMessage={sendMessage}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-text-content">
//                 Select a chat to start messaging
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }