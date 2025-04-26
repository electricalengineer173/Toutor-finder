"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Send, PaperclipIcon } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("conversation-1")
  const [messageText, setMessageText] = useState("")

  // Mock user data
  const user = getCurrentUser() || {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
  }

  // Mock conversations data
  const conversations = [
    {
      id: "conversation-1",
      participant: {
        id: "tutor-1",
        name: "Dr. Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
        role: "tutor",
        subject: "Mathematics",
      },
      lastMessage: {
        text: "I've sent you the practice problems we discussed. Let me know if you have any questions!",
        timestamp: "2023-05-14T14:30:00",
        isRead: false,
      },
      unreadCount: 1,
    },
    {
      id: "conversation-2",
      participant: {
        id: "tutor-2",
        name: "Prof. Michael Chen",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
        role: "tutor",
        subject: "Computer Science",
      },
      lastMessage: {
        text: "Great job on your last assignment! Your code was very well structured.",
        timestamp: "2023-05-13T10:15:00",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: "conversation-3",
      participant: {
        id: "tutor-3",
        name: "Emma Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
        role: "tutor",
        subject: "English Literature",
      },
      lastMessage: {
        text: "I've reviewed your essay and left some comments. Overall, it's looking good!",
        timestamp: "2023-05-12T16:45:00",
        isRead: true,
      },
      unreadCount: 0,
    },
  ]

  // Mock messages data
  const messages = {
    "conversation-1": [
      {
        id: "msg-1-1",
        senderId: "user-1",
        text: "Hi Dr. Johnson, I'm having trouble with the calculus homework, especially problem #3.",
        timestamp: "2023-05-14T10:30:00",
      },
      {
        id: "msg-1-2",
        senderId: "tutor-1",
        text: "Hello John! I'd be happy to help. Could you send me a picture of the problem so I can see exactly what you're working with?",
        timestamp: "2023-05-14T10:35:00",
      },
      {
        id: "msg-1-3",
        senderId: "user-1",
        text: "Sure, here it is. I'm not sure how to approach this integration problem.",
        timestamp: "2023-05-14T10:40:00",
        attachment: {
          type: "image",
          url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
          name: "calculus_problem.jpg",
        },
      },
      {
        id: "msg-1-4",
        senderId: "tutor-1",
        text: "I see the issue. This is a tricky integration by parts problem. Let me walk you through it step by step...",
        timestamp: "2023-05-14T10:50:00",
      },
      {
        id: "msg-1-5",
        senderId: "tutor-1",
        text: "First, you'll want to identify u and dv. In this case, let u = ln(x) and dv = x dx.",
        timestamp: "2023-05-14T10:52:00",
      },
      {
        id: "msg-1-6",
        senderId: "user-1",
        text: "Okay, so then du = 1/x dx and v = x²/2, right?",
        timestamp: "2023-05-14T11:00:00",
      },
      {
        id: "msg-1-7",
        senderId: "tutor-1",
        text: "Exactly! Now you can apply the integration by parts formula: ∫u dv = uv - ∫v du",
        timestamp: "2023-05-14T11:05:00",
      },
      {
        id: "msg-1-8",
        senderId: "user-1",
        text: "That makes sense. So I'll get ln(x) * x²/2 - ∫(x²/2) * (1/x) dx",
        timestamp: "2023-05-14T11:10:00",
      },
      {
        id: "msg-1-9",
        senderId: "tutor-1",
        text: "Perfect! And then you can simplify the second integral to ∫(x/2) dx, which is x²/4 + C",
        timestamp: "2023-05-14T11:15:00",
      },
      {
        id: "msg-1-10",
        senderId: "user-1",
        text: "So the final answer is ln(x) * x²/2 - x²/4 + C?",
        timestamp: "2023-05-14T11:20:00",
      },
      {
        id: "msg-1-11",
        senderId: "tutor-1",
        text: "That's correct! Well done. Would you like me to send you some similar practice problems?",
        timestamp: "2023-05-14T11:25:00",
      },
      {
        id: "msg-1-12",
        senderId: "user-1",
        text: "Yes, that would be really helpful. Thank you!",
        timestamp: "2023-05-14T11:30:00",
      },
      {
        id: "msg-1-13",
        senderId: "tutor-1",
        text: "I've sent you the practice problems we discussed. Let me know if you have any questions!",
        timestamp: "2023-05-14T14:30:00",
        attachment: {
          type: "pdf",
          url: "#",
          name: "integration_practice_problems.pdf",
        },
      },
    ],
    "conversation-2": [
      {
        id: "msg-2-1",
        senderId: "user-1",
        text: "Hello Prof. Chen, I've completed the programming assignment. Could you take a look when you have time?",
        timestamp: "2023-05-12T09:30:00",
      },
      {
        id: "msg-2-2",
        senderId: "tutor-2",
        text: "Hi John, I'd be happy to review it. Please send me the code.",
        timestamp: "2023-05-12T09:45:00",
      },
      {
        id: "msg-2-3",
        senderId: "user-1",
        text: "Here's my solution to the sorting algorithm problem.",
        timestamp: "2023-05-12T10:00:00",
        attachment: {
          type: "code",
          url: "#",
          name: "sorting_algorithm.py",
        },
      },
      {
        id: "msg-2-4",
        senderId: "tutor-2",
        text: "Great job on your last assignment! Your code was very well structured.",
        timestamp: "2023-05-13T10:15:00",
      },
    ],
    "conversation-3": [
      {
        id: "msg-3-1",
        senderId: "user-1",
        text: "Hi Ms. Rodriguez, I've attached my essay on 'The Great Gatsby' for your review.",
        timestamp: "2023-05-11T14:30:00",
        attachment: {
          type: "document",
          url: "#",
          name: "great_gatsby_essay.docx",
        },
      },
      {
        id: "msg-3-2",
        senderId: "tutor-3",
        text: "Thanks for sending this, John. I'll review it and get back to you with feedback.",
        timestamp: "2023-05-11T15:00:00",
      },
      {
        id: "msg-3-3",
        senderId: "tutor-3",
        text: "I've reviewed your essay and left some comments. Overall, it's looking good!",
        timestamp: "2023-05-12T16:45:00",
        attachment: {
          type: "document",
          url: "#",
          name: "great_gatsby_essay_feedback.docx",
        },
      },
    ],
  }

  const selectedMessages = selectedConversation ? messages[selectedConversation as keyof typeof messages] : []
  const selectedConversationData = conversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return

    // In a real app, this would send the message to the server
    console.log("Sending message:", messageText, "to conversation:", selectedConversation)

    // Clear the input
    setMessageText("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search messages..." className="pl-8" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  selectedConversation === conversation.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={conversation.participant.avatar || "/placeholder.svg"}
                      alt={conversation.participant.name}
                    />
                    <AvatarFallback>
                      {conversation.participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.participant.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.text}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 bg-primary text-primary-foreground">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedConversationData?.participant.avatar || "/placeholder.svg"}
                      alt={selectedConversationData?.participant.name}
                    />
                    <AvatarFallback>
                      {selectedConversationData?.participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversationData?.participant.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedConversationData?.participant.subject}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-4">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.senderId === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      } rounded-lg p-3`}
                    >
                      <p>{message.text}</p>
                      {message.attachment && (
                        <div className="mt-2">
                          {message.attachment.type === "image" ? (
                            <div className="mt-2">
                              <img
                                src={message.attachment.url || "/placeholder.svg"}
                                alt="Attachment"
                                className="max-w-full rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2 p-2 bg-background/50 rounded-md">
                              <PaperclipIcon className="h-4 w-4" />
                              <span className="text-sm">{message.attachment.name}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div
                        className={`text-xs mt-1 ${
                          message.senderId === user.id ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
