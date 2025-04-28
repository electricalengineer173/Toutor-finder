"use client"

import { useState, useEffect } from "react"
import { getTeacherById, type TeacherProfile } from "@/lib/api/teachers"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, GraduationCap, Award, BookOpen, MessageSquare, Heart, Star, MapPin, CheckCircle, User, Briefcase } from "lucide-react"
import Link from "next/link"

interface TutorProfileContentProps {
  tutorId: number;
}

export function TutorProfileContent({ tutorId }: TutorProfileContentProps) {
  const [tutor, setTutor] = useState<TeacherProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("about")

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const data = await getTeacherById(tutorId)
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

  // Format the tutor name or use a placeholder
  const tutorName = tutor.user_id ? `Dr. ${tutor.user_id}` : "Experienced Tutor"

  return (
    <div className="bg-gradient-to-b from-primary/5 to-transparent">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full bg-gradient-to-r from-primary/20 to-secondary/20 overflow-hidden">
          {tutor.profile_picture && (
            <div className="absolute inset-0 opacity-10 bg-center bg-cover" style={{
              backgroundImage: `url(${tutor.profile_picture})`,
              filter: 'blur(8px)'
            }} />
          )}
        </div>

        {/* Profile Info Overlay */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-24 bg-white rounded-t-3xl shadow-xl p-6 md:p-8 border border-primary/10">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Avatar */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg">
                  <AvatarImage src={tutor.profile_picture} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {tutorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-center md:items-start mt-4 space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(tutor.average_rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 font-medium">{tutor.average_rating?.toFixed(1) || "New"}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {tutor.total_reviews} verified reviews
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{tutorName}</h1>
                <p className="text-lg text-muted-foreground mb-4">{tutor.short_description}</p>

                <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                  {tutor.subjects?.map((subject) => (
                    <Badge key={subject.id} variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 rounded-full">
                      {subject.name}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-primary">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium">Experience</span>
                    </div>
                    <span className="text-sm">{tutor.years_of_experience} years</span>
                  </div>

                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-primary">
                      <GraduationCap className="h-4 w-4" />
                      <span className="font-medium">Education</span>
                    </div>
                    <span className="text-sm">
                      {Array.isArray(tutor.education)
                        ? tutor.education.length > 0
                          ? `${tutor.education[0].degree} in ${tutor.education[0].field}`
                          : 'Not specified'
                        : typeof tutor.education === 'string'
                          ? tutor.education.length > 20
                            ? tutor.education.substring(0, 20) + '...'
                            : tutor.education
                          : 'Not specified'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-primary">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Students</span>
                    </div>
                    <span className="text-sm">50+ taught</span>
                  </div>

                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Response</span>
                    </div>
                    <span className="text-sm">Usually within 2 hours</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button className="luxury-button">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Tutor
                  </Button>
                  <Button variant="outline" className="luxury-button-outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Session
                  </Button>
                  <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-10 w-10 rounded-full">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-b-3xl shadow-xl border border-t-0 border-primary/10 p-6 md:p-8 mb-8">
          <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="about" className="text-sm md:text-base">About</TabsTrigger>
              <TabsTrigger value="subjects" className="text-sm md:text-base">Subjects & Rates</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm md:text-base">Reviews</TabsTrigger>
              <TabsTrigger value="availability" className="text-sm md:text-base">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-8">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-primary mb-4">About {tutorName}</h2>
                <div className="text-muted-foreground whitespace-pre-line">
                  {tutor.long_description || "No detailed description available."}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-primary/10 shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">Education</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground">
                      {Array.isArray(tutor.education)
                        ? tutor.education.length > 0
                          ? (
                            <ul className="space-y-2">
                              {tutor.education.map((edu, index) => (
                                <li key={index}>
                                  <div className="font-medium">{edu.degree} in {edu.field}</div>
                                  <div>{edu.institution}, {edu.year}</div>
                                </li>
                              ))}
                            </ul>
                          )
                          : "Education details not provided."
                        : typeof tutor.education === 'string'
                          ? tutor.education
                          : "Education details not provided."}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/10 shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">Certifications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground">
                      {Array.isArray(tutor.certifications)
                        ? tutor.certifications.length > 0
                          ? (
                            <ul className="space-y-2">
                              {tutor.certifications.map((cert, index) => (
                                <li key={index}>
                                  <div className="font-medium">{cert.name}</div>
                                  <div>{cert.issuer}, {cert.year}</div>
                                </li>
                              ))}
                            </ul>
                          )
                          : "Certification details not provided."
                        : typeof tutor.certifications === 'string'
                          ? tutor.certifications
                          : "Certification details not provided."}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/10 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">Teaching Philosophy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {tutor.teaching_philosophy || "Teaching philosophy not provided."}
                  </div>
                </CardContent>
              </Card>

              {tutor.achievements && (
                <Card className="border-primary/10 shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">Achievements</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground whitespace-pre-line">
                      {tutor.achievements}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-primary mb-4">Subjects & Rates</h2>
                <p className="text-muted-foreground">
                  Browse the subjects taught by {tutorName} and their corresponding hourly rates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutor.subjects?.map((subject) => (
                  <Card key={subject.id} className="border-primary/10 shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-primary">{subject.name}</h3>
                        <div className="text-xl font-bold text-primary">${subject.hourly_rate}/hr</div>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <p className="text-muted-foreground">{subject.description}</p>
                      <div className="mt-4 flex justify-end">
                        <Button>Book a Session</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!tutor.subjects || tutor.subjects.length === 0) && (
                  <div className="col-span-2 text-center py-12 bg-primary/5 rounded-lg">
                    <p className="text-muted-foreground">No subjects listed for this tutor.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-primary mb-4">Student Reviews</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex flex-col items-center justify-center bg-primary/5 p-4 rounded-lg min-w-[100px]">
                    <span className="text-4xl font-bold text-primary">{tutor.average_rating?.toFixed(1) || "N/A"}</span>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= Math.round(tutor.average_rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground mt-1">{tutor.total_reviews} reviews</span>
                  </div>

                  <div className="flex-1">
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const reviewsWithRating = tutor.reviews?.filter(r => Math.round(r.rating) === rating) || [];
                        const percentage = tutor.reviews?.length
                          ? (reviewsWithRating.length / tutor.reviews.length) * 100
                          : 0;

                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="flex items-center min-w-[40px]">
                              <span>{rating}</span>
                              <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground min-w-[40px]">
                              {reviewsWithRating.length}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {tutor.reviews && tutor.reviews.length > 0 ? (
                <div className="space-y-6">
                  {tutor.reviews.map((review) => (
                    <Card key={review.id} className="border-primary/10 shadow-md">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {String.fromCharCode(65 + (review.student_id % 26))}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">Student {review.student_id}</h4>
                                <div className="flex items-center mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${star <= Math.round(review.rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="mt-3 text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-primary/5 rounded-lg">
                  <p className="text-muted-foreground">No reviews yet for this tutor.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-primary mb-4">Availability</h2>
                <p className="text-muted-foreground mb-6">
                  View {tutorName}'s availability and book a session at a time that works for you.
                </p>
              </div>

              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle>Weekly Schedule</CardTitle>
                  <CardDescription>The tutor's regular availability throughout the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="p-3 border rounded-lg text-center">
                        <h4 className="font-medium mb-2">{day}</h4>
                        <div className="text-sm text-muted-foreground">
                          {Math.random() > 0.3 ? '9:00 AM - 5:00 PM' : 'Not Available'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6">
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Session
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Tutors Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Similar Tutors You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-primary/10 shadow-md overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 relative">
                  <Avatar className="absolute -bottom-6 left-6 h-16 w-16 border-4 border-white">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {String.fromCharCode(64 + i)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="pt-10">
                  <h3 className="font-bold text-lg">Dr. Example Tutor {i}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Mathematics & Physics Expert</p>
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${star <= 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs ml-1">4.0</span>
                    <span className="text-xs text-muted-foreground ml-1">(24 reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {['Mathematics', 'Physics'].map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/tutors/${tutorId + i}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}