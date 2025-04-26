import { TutorFilters } from "@/components/tutor-filters"
import { TutorList } from "@/components/tutor-list"

export default function TutorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Your Perfect Tutor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TutorFilters />
        </div>
        <div className="lg:col-span-3">
          <TutorList />
        </div>
      </div>
    </div>
  )
}
