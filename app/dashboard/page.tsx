"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpcomingLessons } from "@/components/upcoming-lessons"
import { PastLessons } from "@/components/past-lessons"
import { FavoriteTutors } from "@/components/favorite-tutors"
import { DashboardChatPreview } from "@/components/dashboard-chat-preview"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const { toast } = useToast()

  // Check if teacher has completed their profile
  useEffect(() => {
    const checkTeacherProfile = async () => {
      if (user?.role === "teacher") {
        try {
          // Check if teacher has completed their profile
          const teacherProfile = await import('@/lib/api/teachers').then(module => module.getCurrentTeacherProfile())

          // If the teacher has no subjects or no teaching philosophy, they need to complete onboarding
          if (!teacherProfile.subjects || teacherProfile.subjects.length === 0 ||
              !teacherProfile.teaching_philosophy) {
            toast({
              title: "Complete Your Profile",
              description: "Please complete your teacher profile to start tutoring.",
            })
            router.push("/teacher-onboarding")
          }
        } catch (error) {
          console.error('Error checking teacher profile:', error)
          // If there's an error fetching the profile, redirect to onboarding
          router.push("/teacher-onboarding")
        }
      }
    }

    if (user) {
      checkTeacherProfile()
    }
  }, [user, router, toast])

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your scheduled lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{user?.upcomingSessions || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Completed Sessions</CardTitle>
              <CardDescription>Total lessons taken</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{user?.completedSessions || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Favorite Tutors</CardTitle>
              <CardDescription>Tutors you've saved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{user?.favoriteTutors?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming Lessons</TabsTrigger>
                <TabsTrigger value="past">Past Lessons</TabsTrigger>
                <TabsTrigger value="favorites">Favorite Tutors</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <UpcomingLessons userId={user?.id?.toString() || ''} />
              </TabsContent>

              <TabsContent value="past">
                <PastLessons userId={user?.id?.toString() || ''} />
              </TabsContent>

              <TabsContent value="favorites">
                <FavoriteTutors userId={user?.id?.toString() || ''} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-1">
            <DashboardChatPreview />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
