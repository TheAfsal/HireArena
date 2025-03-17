"use client"

import { generateMessages, generateUsers } from "@/lib/mock-data"
import { useState, useEffect } from "react"
import { UserList } from "./components/user-list"
import { ChatInterface } from "./components/chat-interface"
import { ThemeToggle } from "./components/theme-toggle"

export interface User {
    id: string
    name: string
    avatar: string
    status: string
    lastSeen?: Date
  }
  
  export interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    timestamp: Date
    status: "sent" | "delivered" | "read"
    read?: boolean
  }
  

export default function ChatApp() {
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Generate mock data
    const mockUsers = generateUsers(15)
    setUsers(mockUsers)

    // Generate mock messages for each user
    const mockMessages: { [key: string]: Message[] } = {}
    mockUsers.forEach((user) => {
      mockMessages[user.id] = generateMessages(user.id, 10)
    })
    setMessages(mockMessages)

    // Set first user as selected by default
    if (mockUsers.length > 0) {
      setSelectedUser(mockUsers[0])
    }
  }, [])

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sendMessage = (content: string) => {
    if (!selectedUser || !content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "currentUser",
      receiverId: selectedUser.id,
      content,
      timestamp: new Date(),
      status: "sent",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    }))

    // Simulate message being delivered after 1 second
    setTimeout(() => {
      setMessages((prev) => {
        const updatedMessages = [...prev[selectedUser.id]]
        const messageIndex = updatedMessages.findIndex((m) => m.id === newMessage.id)
        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            status: "delivered",
          }
        }
        return {
          ...prev,
          [selectedUser.id]: updatedMessages,
        }
      })
    }, 1000)

    // Simulate message being read after 2 seconds
    setTimeout(() => {
      setMessages((prev) => {
        const updatedMessages = [...prev[selectedUser.id]]
        const messageIndex = updatedMessages.findIndex((m) => m.id === newMessage.id)
        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            status: "read",
          }
        }
        return {
          ...prev,
          [selectedUser.id]: updatedMessages,
        }
      })
    }, 2000)

    // Simulate reply after 3 seconds
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedUser.id,
        receiverId: "currentUser",
        content: `Reply to: ${content}`,
        timestamp: new Date(),
        status: "read",
      }

      setMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), reply],
      }))
    }, 3000)
  }

  return (
    <div className="flex h-screen bg-background">
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
          {selectedUser ? (
            <ChatInterface user={selectedUser} messages={messages[selectedUser.id] || []} onSendMessage={sendMessage} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-text-content">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}

