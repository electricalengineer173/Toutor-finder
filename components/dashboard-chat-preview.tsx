import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAllChats } from "@/lib/chat"

export function DashboardChatPreview() {
  // Get the current user
  const user = getCurrentUser()
  if (!user) return null

  // Get all chats for the user
  const chats = getAllChats(user.id)

  // Get the 3 most recent chats
  const recentChats = chats.slice(0, 3)

  // Count total unread messages
  const unreadCount = chats.reduce((total, chat) => {
    const unreadMessages = chat.messages.filter((m) => m.senderId !== user.id && !m.isRead)
    return total + unreadMessages.length
  }, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/chat">
            View All
            {unreadCount > 0 && <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount}</Badge>}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recentChats.length > 0 ? (
          <div className="space-y-4">
            {recentChats.map((chat) => {
              const participant = chat.participants.find((p) => p.id !== user.id)
              if (!participant) return null

              const lastMessage = chat.messages[chat.messages.length - 1]
              const unreadCount = chat.messages.filter((m) => m.senderId !== user.id && !m.isRead).length

              return (
                <Link key={chat.id} href={`/chat/${chat.id}`} className="block">
                  <div
                    className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${
                      unreadCount > 0 ? "border-l-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback>
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{participant.name}</h3>
                          <span className="text-xs text-muted-foreground">
                            {new Date(lastMessage.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{lastMessage.text}</p>
                          {unreadCount > 0 && (
                            <Badge className="ml-2 bg-primary text-primary-foreground">{unreadCount}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">No messages yet</p>
            <Button asChild className="mt-4">
              <Link href="/chat/new">Start a Conversation</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
