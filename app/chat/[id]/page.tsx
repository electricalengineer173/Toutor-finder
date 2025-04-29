"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useChatStore } from "@/lib/stores/chat-store"
import * as userMapping from '@/lib/utils/user-mapping'
import * as usersApi from '@/lib/api/users'
import Link from "next/link"

export default function ChatPage() {
  const params = useParams()
  const chatId = parseInt(params.id as string)
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [cachedUserInfo, setCachedUserInfo] = useState<{userId: number, username: string, email: string} | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const user = useAuthStore(state => state.user)
  const { conversations, getConversation, sendMessage, markMessageAsRead } = useChatStore()
  const conversation = conversations[chatId]

  // Load cached user information from localStorage
  useEffect(() => {
    if (!user) return;

    try {
      // Try to get cached user info from localStorage based on role and chat ID
      const storageKey = user.role === 'student'
        ? `chat_teacher_${chatId}`
        : `chat_student_${chatId}`;

      const storedData = localStorage.getItem(storageKey);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log(`Found cached user info for ${storageKey}:`, parsedData);
        setCachedUserInfo(parsedData);
      } else {
        console.log(`No cached user info found for ${storageKey}`);
      }
    } catch (error) {
      console.error('Error loading cached user info:', error);
    }
  }, [user, chatId]);

  // Load conversation data
  useEffect(() => {
    const loadConversation = async () => {
      try {
        setError(null);

        // Initialize user mappings first
        await userMapping.initializeUserMappings();

        if (chatId) {
          await getConversation(chatId);
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
        setError('Failed to load conversation. Please try again later.');
      }
    };

    loadConversation();
  }, [chatId, getConversation]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Mark unread messages as read
    if (conversation?.messages) {
      conversation.messages.forEach(msg => {
        if (msg.recipient_id === user?.id && !msg.is_read) {
          markMessageAsRead(msg.id);
        }
      });
    }
  }, [conversation?.messages, user?.id, markMessageAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    try {
      await sendMessage(chatId, message);
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Please log in to view your messages</p>
        <Button asChild className="mt-4">
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  // Get user information from conversation or cached data
  const otherUser = conversation?.messages[0]?.sender_id === user.id
    ? conversation?.messages[0]?.recipient
    : conversation?.messages[0]?.sender;

  // Use cached user info if available, otherwise fall back to conversation data
  const displayName = cachedUserInfo?.username || otherUser?.username || (user.role === 'student' ? `Teacher ${chatId}` : `Student ${chatId}`);
  const displayEmail = cachedUserInfo?.email || otherUser?.email || (user.role === 'student' ? 'Teacher' : 'Student');
  const displayInitial = displayName[0]?.toUpperCase() || (user.role === 'student' ? `T` : `S`);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="h-[calc(100vh-8rem)]">
        <CardHeader className="border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {displayInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>
                {displayName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
          {error ? (
            <div className="flex-1 flex items-center justify-center text-destructive">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation?.messages.map((msg) => {
                  const isOwnMessage = msg.sender_id === user.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isOwnMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-xs opacity-70">
                            {new Date(msg.sent_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {!isOwnMessage && !msg.is_read && (
                            <span className="text-xs opacity-70">Unread</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
