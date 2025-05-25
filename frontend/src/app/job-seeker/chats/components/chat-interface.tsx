"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  MoreVertical,
  ArrowLeft,
  Check,
  CheckCheck,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Message, User } from "./chat";

interface ChatInterfaceProps {
  myId: string;
  user: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onTyping: () => void;
  typingUsers: { [key: string]: boolean };
}

export function ChatInterface({
  myId,
  user,
  messages,
  onSendMessage,
  onTyping,
  typingUsers,
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    onTyping();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      <div className="flex items-center p-3 border-b border-border bg-card">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-medium text-text-header">{user.name}</h2>
          <p className="text-xs text-text-content">{user.status}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-background">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === myId;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-card text-text-header rounded-tl-none"
                  }`}
                >
                  <p>{message.content}</p>
                  <div
                    className={`flex items-center justify-end mt-1 text-xs ${
                      isCurrentUser ? "text-white/70" : "text-text-content"
                    }`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    {isCurrentUser && (
                      <span className="ml-1">{renderMessageStatus(message.status)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {Object.keys(typingUsers).length > 0 && (
            <div className="text-sm text-gray-500 italic">
              {user.name} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type a message"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="bg-muted"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}