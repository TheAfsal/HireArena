// "use client";

// import { useState, useRef, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Send,
//   MoreVertical,
//   ArrowLeft,
//   Check,
//   CheckCheck,
// } from "lucide-react";
// import { formatTime } from "@/lib/utils";
// import { Message, User } from "../page";

// interface ChatInterfaceProps {
//   companyId:string
//   user: User;
//   messages: Message[];
//   onSendMessage: (content: string) => void;
// }

// export function ChatInterface({
//   companyId,
//   user,
//   messages,
//   onSendMessage,
// }: ChatInterfaceProps) {
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       onSendMessage(newMessage);
//       setNewMessage("");
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const renderMessageStatus = (status: string) => {
//     switch (status) {
//       case "sent":
//         return <Check className="h-3 w-3 text-text-content" />;
//       case "delivered":
//         return <CheckCheck className="h-3 w-3 text-text-content" />;
//       case "read":
//         return <CheckCheck className="h-3 w-3 text-primary" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center p-3 border-b border-border bg-card">
//         <Button variant="ghost" size="icon" className="mr-2">
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <Avatar className="h-10 w-10 mr-3">
//           <AvatarImage src={user.image} alt={user.fullName} />
//           <AvatarFallback>
//             {user.fullName.substring(0, 2).toUpperCase()}
//           </AvatarFallback>
//         </Avatar>
//         <div className="flex-1">
//           <h2 className="font-medium text-text-header">{user.fullName}</h2>
//           <p className="text-xs text-text-content">{user.status}</p>
//         </div>
//         <div className="flex space-x-2">
//           <Button variant="ghost" size="icon">
//             <MoreVertical className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>

//       <ScrollArea className="flex-1 p-4 bg-background">
//         <div className="space-y-4">
//           {messages.map((message) => {
//             const isCurrentUser = message.senderId === companyId; 
//             return (
//               <div
//                 key={message.id}
//                 className={`flex ${
//                   isCurrentUser ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-[70%] rounded-lg p-3 ${
//                     isCurrentUser
//                       ? "bg-primary text-white rounded-tr-none"
//                       : "bg-card text-text-header rounded-tl-none"
//                   }`}
//                 >
//                   <p>{message.content}</p>
//                   <div
//                     className={`flex items-center justify-end mt-1 text-xs ${
//                       isCurrentUser ? "text-white/70" : "text-text-content"
//                     }`}
//                   >
//                     <span>{formatTime(message.timestamp)}</span>
//                     {isCurrentUser && (
//                       <span className="ml-1">
//                         {renderMessageStatus(message.status)}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//           <div ref={messagesEndRef} />
//         </div>
//       </ScrollArea>

//       <div className="p-3 border-t border-border bg-card">
//         <div className="flex items-center space-x-2">
//           <Input
//             placeholder="Type a message"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={handleKeyPress}
//             className="bg-muted"
//           />
//           <Button
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim()}
//             size="icon"
//             className="bg-primary text-white hover:bg-primary/90"
//           >
//             <Send className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
