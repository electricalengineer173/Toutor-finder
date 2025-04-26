"use client"

import { useState, useEffect } from "react"
import { getTutorById, type TutorProfile } from "@/lib/api/tutors"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"

interface TutorProfileContentProps {
  tutorId: number;
}

export function TutorProfileContent({ tutorId }: TutorProfileContentProps) {
  const [tutor, setTutor] = useState<TutorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const data = await getTutorById(tutorId)
        setTutor(data)
      } catch (err) {
        setError('Failed to load tutor profile')
        console.error('Error fetching tutor:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTutor()
  }, [tutorId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !tutor) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        {error || 'Tutor not found'}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tutor Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={tutor.profile_picture} />
                <AvatarFallback>TU</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Tutor Profile</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm">{tutor.average_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({tutor.total_reviews} reviews)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{tutor.short_description}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Subjects & Rates</h3>
              <div className="flex flex-col gap-2">
                {tutor.subjects.map((subject) => (
                  <div 
                    key={subject.id} 
                    className="flex justify-between items-center p-2 rounded-lg bg-primary/5"
                  >
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">{subject.description}</p>
                    </div>
                    <p className="font-medium">${subject.hourly_rate}/hr</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Experience</h3>
              <p className="text-sm text-muted-foreground">{tutor.years_of_experience} years</p>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Qualifications & Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Detailed Profile</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{tutor.long_description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Education</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{tutor.education}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Certifications</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{tutor.certifications}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Teaching Philosophy</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{tutor.teaching_philosophy}</p>
            </div>

            {tutor.achievements && (
              <div>
                <h3 className="font-medium mb-2">Achievements</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{tutor.achievements}</p>
              </div>
            )}

            {tutor.reviews.length > 0 && (
              <div>
                <h3 className="font-medium mb-4">Student Reviews</h3>
                <div className="space-y-4">
                  {tutor.reviews.map((review) => (
                    <div key={review.id} className="border-l-2 border-primary/30 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1">{review.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 