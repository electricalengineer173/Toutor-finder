"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useChatStore } from "@/lib/stores/chat-store"
import * as userMapping from '@/lib/utils/user-mapping'

export default function ChatsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const user = useAuthStore(state => state.user)
  const { conversations, loadConversations } = useChatStore()

  useEffect(() => {
    // Initialize user mappings first, then load conversations
    const init = async () => {
      await userMapping.initializeUserMappings();
      loadConversations();
    };

    init();
  }, [loadConversations]);

  // Convert conversations object to array for filtering
  const conversationsList = Object.entries(conversations).map(([teacherId, conversation]) => ({
    id: parseInt(teacherId),
    ...conversation
  }));

  // Filter conversations based on search term (will need to integrate with user search)
  const filteredConversations = conversationsList;

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button asChild>
          <Link href="/chat/new">New Message</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chats List */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const lastMessage = conversation.lastMessage;

                    return (
                      <Link key={conversation.id} href={`/chat/${conversation.id}`} className="block">
                        <div
                          className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${
                            conversation.unreadCount > 0 ? "border-l-4 border-primary" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {conversation.lastMessage ?
                                  (user.role === 'student' ?
                                    conversation.lastMessage.sender.id === user.id ?
                                      conversation.lastMessage.recipient.username?.[0]?.toUpperCase() :
                                      conversation.lastMessage.sender.username?.[0]?.toUpperCase()
                                    :
                                    conversation.lastMessage.sender.id === user.id ?
                                      conversation.lastMessage.recipient.username?.[0]?.toUpperCase() :
                                      conversation.lastMessage.sender.username?.[0]?.toUpperCase()
                                  )
                                  :
                                  (user.role === 'student' ? `T` : `S`)
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate">
                                  {/* Try to get the username from the last message if available */}
                                  {conversation.lastMessage ?
                                    (user.role === 'student' ?
                                      conversation.lastMessage.sender.id === user.id ?
                                        conversation.lastMessage.recipient.username :
                                        conversation.lastMessage.sender.username
                                      :
                                      conversation.lastMessage.sender.id === user.id ?
                                        conversation.lastMessage.recipient.username :
                                        conversation.lastMessage.sender.username
                                    )
                                    :
                                    (user.role === 'student' ? `Tutor ${conversation.id}` : `Student ${conversation.id}`)
                                  }
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {lastMessage ? new Date(lastMessage.sent_at).toLocaleDateString() : "No messages"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate">
                                  {lastMessage ? lastMessage.content : "Start a conversation"}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <Badge className="ml-2 bg-primary text-primary-foreground">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-muted-foreground">
                      {searchTerm ? "No conversations match your search" : "No conversations yet"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State or Selected Chat Preview */}
        <div className="md:col-span-2">
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground mb-6">Choose a conversation from the list or start a new one</p>
              <Button asChild>
                <Link href="/chat/new">New Message</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
