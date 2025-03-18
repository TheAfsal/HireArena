import { Message, User } from "@/app/job-seeker/chats/page"


export function generateUsers(count: number): User[] {
  const users: User[] = []

  for (let i = 1; i <= count; i++) {
    users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      avatar: `/placeholder.svg?height=200&width=200&text=User${i}`,
      status: i % 3 === 0 ? "Online" : "Last seen recently",
      lastSeen: i % 3 === 0 ? undefined : new Date(Date.now() - Math.random() * 86400000),
    })
  }

  return users
}

export function generateMessages(userId: string, count: number): Message[] {
  const messages: Message[] = []
  const now = new Date()

  for (let i = 1; i <= count; i++) {
    const isFromUser = i % 2 === 0
    const timestamp = new Date(now.getTime() - (count - i) * 300000) // Messages spaced 5 minutes apart

    messages.push({
      id: `msg-${userId}-${i}`,
      senderId: isFromUser ? userId : "currentUser",
      receiverId: isFromUser ? "currentUser" : userId,
      content: isFromUser ? `This is a message from ${userId} - ${i}` : `This is a reply to ${userId} - ${i}`,
      timestamp,
      status: "read",
      read: true,
    })
  }

  return messages
}

