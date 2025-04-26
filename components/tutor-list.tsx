"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarRating } from "@/components/star-rating"
import { Heart, Loader2 } from "lucide-react"
import { getTutors } from "@/lib/data" // Keep for fallback
import * as teachersApi from "@/lib/api/teachers"
import { TeacherProfile } from "@/lib/api/teachers"

export function TutorList() {
  const [sortBy, setSortBy] = useState("recommended")
  const [tutors, setTutors] = useState<TeacherProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchTutors = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Determine sort parameters based on sortBy value
        const params: Record<string, any> = {
          limit: 10,
          skip: 0
        }

        if (sortBy === "rating-high") {
          params.sort_by = "rating"
          params.sort_order = "desc"
        } else if (sortBy === "price-low") {
          params.sort_by = "hourly_rate"
          params.sort_order = "asc"
        } else if (sortBy === "price-high") {
          params.sort_by = "hourly_rate"
          params.sort_order = "desc"
        } else if (sortBy === "experience") {
          params.sort_by = "experience"
          params.sort_order = "desc"
        }

        // Fetch teachers from API
        const [teachersResponse, countResponse] = await Promise.all([
          teachersApi.getAllTeachers(params),
          teachersApi.getTeacherCount()
        ])

        setTutors(teachersResponse)
        setTotalCount(countResponse.total)
      } catch (err) {
        console.error("Error fetching tutors:", err)
        setError("Failed to load tutors. Using mock data instead.")
        // Fallback to mock data
        setTutors(getTutors())
      } finally {
        setIsLoading(false)
      }
    }

    fetchTutors()
  }, [sortBy])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-muted-foreground">
          {isLoading ? "Loading tutors..." : `Showing ${tutors.length} of ${totalCount} tutors`}
        </p>
        <Select value={sortBy} onValueChange={setSortBy} disabled={isLoading}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="rating-high">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="experience">Most Experienced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tutors.map((tutor) => (
          <Card key={tutor.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-48 md:h-auto bg-muted shrink-0">
                  <img
                    src={tutor.profile_picture || "/placeholder.svg"}
                    alt={`Tutor ${tutor.id}`}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 text-muted-foreground hover:text-primary"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">
                        {/* Use username or ID if name not available */}
                        {tutor.user_id}
                      </h3>
                      <div className="flex items-center">
                        <StarRating rating={tutor.average_rating || 0} />
                        <span className="ml-1 text-sm">({tutor.total_reviews || 0})</span>
                      </div>
                    </div>
                    <span className="font-medium">
                      ${tutor.subjects && tutor.subjects[0] ? tutor.subjects[0].hourly_rate : 0}/hour
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{tutor.short_description || "Tutor"}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tutor.subjects && tutor.subjects.slice(0, 5).map((subject) => (
                      <Badge key={subject.id} variant="secondary" className="text-xs">
                        {subject.name}
                      </Badge>
                    ))}
                    {tutor.subjects && tutor.subjects.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{tutor.subjects.length - 5} more
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mb-4 line-clamp-2">{tutor.long_description || tutor.short_description || "No description available"}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span>{tutor.years_of_experience || 0} years experience</span>
                    <span>{tutor.education || "Education not specified"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild>
                      <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
                    </Button>
                    <Button variant="outline">Message</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      )}

      {!isLoading && !error && tutors.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline">Load More Tutors</Button>
        </div>
      )}
    </div>
  )
}
