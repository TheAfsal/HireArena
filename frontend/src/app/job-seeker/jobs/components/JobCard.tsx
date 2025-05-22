import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BriefcaseIcon, Clock, DollarSign, MapPin } from "lucide-react"

function JobCard({ job, viewMode = "list" }: { job: any; viewMode?: "list" | "grid" }) {
  // Format the job description to be shorter
  const shortDescription = job.responsibilities?.substring(0, 100) + "..." || ""

  // Format salary if available
  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  if (viewMode === "grid") {
    return (
      <Link
        href={`/job-seeker/jobs/${job.id}`}
        className="group flex flex-col h-full rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="p-5 flex-1">
          <div className="flex items-center justify-between mb-4">
            <Avatar className="h-12 w-12 border border-gray-100">
              <AvatarImage src={job.companyLogo || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary-50 text-primary-700">{job.companyName?.[0] || "C"}</AvatarFallback>
            </Avatar>
            {job.isNew && <Badge className="bg-green-100 text-green-800 border-0">New</Badge>}
          </div>

          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary-600 transition-colors">{job.jobTitle}</h3>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span className="font-medium text-gray-700">{job.companyName}</span>
            <span className="mx-1.5">•</span>
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{job.companyLocation || "Remote"}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{shortDescription}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.requiredSkills?.slice(0, 3).map((tag: any) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
              >
                {tag.name}
              </Badge>
            ))}
            {job.requiredSkills?.length > 3 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                +{job.requiredSkills.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <Button size="sm" className="rounded-full px-4 bg-primary-600 hover:bg-primary-700">
              View Job
            </Button>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/job-seeker/jobs/${job.id}`}
      className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4 mb-4 sm:mb-0">
        <Avatar className="h-14 w-14 border border-gray-100">
          <AvatarImage src={job.companyLogo || "/placeholder.svg"} />
          <AvatarFallback className="bg-primary-50 text-primary-700 text-lg">
            {job.companyName?.[0] || "C"}
          </AvatarFallback>
        </Avatar>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg group-hover:text-primary-600 transition-colors">{job.jobTitle}</h3>
            {job.isNew && <Badge className="bg-green-100 text-green-800 border-0">New</Badge>}
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="font-medium text-gray-700">{job.companyName}</span>
            <span className="mx-1.5">•</span>
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{job.companyLocation || "Remote"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.requiredSkills?.slice(0, 4).map((tag: any) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
              >
                {tag.name}
              </Badge>
            ))}
            {job.requiredSkills?.length > 4 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                +{job.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:items-end gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <BriefcaseIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />
            <span>{job.jobDescription || "Full-time"}</span>
          </div>

          {job.salaryMin && job.salaryMax && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
          )}
        </div>

        <Button className="rounded-full px-6 bg-primary-600 hover:bg-primary-700">View Details</Button>
      </div>
    </Link>
  )
}

export default JobCard
