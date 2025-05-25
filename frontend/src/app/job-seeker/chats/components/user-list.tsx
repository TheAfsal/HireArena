"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Message, UserListProps } from "./chat";

export function UserList({
  myId,
  users,
  selectedUser,
  onSelectUser,
  searchQuery,
  onSearchChange,
  messages,
  notifications,
  userType,
}: UserListProps) {
  const renderMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-500" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-500" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-card">
        <h1 className="text-xl font-bold mb-4 text-text-header">Chats</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-sub-header h-4 w-4" />
          <Input
            placeholder="Search contacts"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted text-text-content"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {users.length === 0 ? (
            <p className="text-center py-4 text-text-content">
              No contacts found
            </p>
          ) : (
            users.map((user) => {
              const conversationId = user._id;
              const userMessages = messages[conversationId] || [];
              const lastMessage =
                userMessages.length > 0
                  ? userMessages[userMessages.length - 1]
                  : null;
              const unreadCount = userMessages.filter(
                (m) => m.senderId !== myId && m.status !== "read"
              ).length;

              return (
                <div
                  key={user._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer mb-1 hover:bg-muted ${
                    selectedUser?._id === user._id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-text-header truncate">
                        {user.name}
                      </h3>
                      {lastMessage && (
                        <span className="text-xs text-text-content flex items-center">
                          {formatDistanceToNow(lastMessage.timestamp)}
                          {lastMessage.senderId === myId && (
                            <span className="ml-1">
                              {renderMessageStatus(lastMessage.status)}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-text-content truncate">
                          {lastMessage.senderId === myId ? "You: " : ""}
                          {lastMessage.content}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
