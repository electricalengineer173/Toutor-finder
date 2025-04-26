"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, X } from "lucide-react"

export function TutorFilters() {
  const [priceRange, setPriceRange] = useState([20, 100])
  const [searchTerm, setSearchTerm] = useState("")

  const subjects = [
    { id: "math", label: "Mathematics" },
    { id: "science", label: "Science" },
    { id: "english", label: "English" },
    { id: "history", label: "History" },
    { id: "programming", label: "Programming" },
    { id: "languages", label: "Foreign Languages" },
    { id: "test-prep", label: "Test Preparation" },
    { id: "music", label: "Music" },
  ]

  const availability = [
    { id: "weekdays", label: "Weekdays" },
    { id: "weekends", label: "Weekends" },
    { id: "evenings", label: "Evenings" },
    { id: "mornings", label: "Mornings" },
  ]

  const resetFilters = () => {
    setPriceRange([20, 100])
    setSearchTerm("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
          <X className="mr-1 h-3 w-3" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tutors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Accordion type="multiple" defaultValue={["subjects", "price", "availability"]}>
          <AccordionItem value="subjects">
            <AccordionTrigger>Subjects</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox id={`subject-${subject.id}`} />
                    <Label htmlFor={`subject-${subject.id}`} className="text-sm font-normal">
                      {subject.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider value={priceRange} min={10} max={200} step={5} onValueChange={setPriceRange} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}+</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="availability">
            <AccordionTrigger>Availability</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {availability.map((time) => (
                  <div key={time.id} className="flex items-center space-x-2">
                    <Checkbox id={`time-${time.id}`} />
                    <Label htmlFor={`time-${time.id}`} className="text-sm font-normal">
                      {time.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ratings">
            <AccordionTrigger>Ratings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="text-sm font-normal">
                      {rating}+ stars
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  )
}
