"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { applyJob, fetchAppliedJobStatus, fetchJobDetails } from "@/app/api/job"
import { MapPin, Share2, BriefcaseIcon, DollarSign, LocateIcon, Building2, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import getBadgeClass from "@/app/jobs/[jobId]/components/getBadgeClass";
import MainContent from "@/app/jobs/[jobId]/components/mainContent";

export interface JobDetails {
  id: string
  jobTitle: string
  salaryMin: number
  salaryMax: number
  jobDescription: string
  responsibilities: string
  location: string
  qualifications: string
  niceToHave: string
  benefits: Array<{ title: string }>
  companyName: string
  logo?: string
  employmentTypes: Array<{ type: string }>
  categories: Array<{ name: string }>
  requiredSkills: Array<{ name: string }>
  createdAt: string
  isApplied: boolean
  testOptions: {
    "Aptitude Test": boolean
    "Behavioral Interview": boolean
    "Coding Challenge": boolean
    "Machine Task": boolean
    "Technical Interview": boolean
  }
}

function Page() {
  const { jobId } = useParams<{ jobId: string }>()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()

  const [isApplying, setIsApplying] = useState(false)

  const {
    data: jobDetails,
    error,
    isLoading,
  } = useQuery<JobDetails>({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
    enabled: !!jobId,
  })

  const { data: statusDetails } = useQuery({
    queryKey: ["jobStatus"],
    queryFn: () => fetchAppliedJobStatus(jobId as string),
  })

  const handleJobApply = async () => {
    setIsApplying(true)
    try {
      const response = await applyJob(jobId as string)

      console.log(response)

      if (response.interviewId) {
        router.push(`/job-seeker/aptitude/${response.interviewId}`)
        return
      }

      toast({
        variant: "default",
        title: "Application Submitted",
        description: `You have successfully applied to ${jobDetails?.jobTitle || "this job"}`,
      })

      await queryClient.invalidateQueries({
        queryKey: ["jobDetails", jobId],
      })
      await queryClient.invalidateQueries({
        queryKey: ["jobStatus"],
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Application Error",
        description: "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        </div>
    )
  }

  if (!jobDetails && error) {
    return (
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-red-500">{"Job not found"}</p>
        </div>
    )
  }

  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  const dateStr = (dateStr: any) => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 lg:py-12">
        {/* Header */}
        <Card className="mb-10 overflow-hidden border-none shadow-lg">
          <div className="bg-gradient-to-r from-primary-50 via-primary-100 to-primary-50 p-8 md:p-10 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Left side - Company info */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarImage src={jobDetails?.logo || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl font-bold">
                      {jobDetails?.companyName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200 px-2.5 py-0.5">
                      {jobDetails?.employmentTypes
                          ?.map((typeItem) => typeItem.type.replace("_", " "))
                          .reverse()
                          .join(", ")}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2.5 py-0.5">
                      New
                    </Badge>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{jobDetails?.jobTitle}</h1>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{jobDetails?.companyName}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{jobDetails?.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex flex-col md:ml-auto gap-4">
                <div className="flex gap-2 justify-end">
                  <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-10 w-10 bg-white hover:bg-gray-100"
                      onClick={async () => {
                        if (navigator.share) {
                          await navigator.share({
                            title: jobDetails?.jobTitle || "Job Posting",
                            text: `Check out this job: ${jobDetails?.jobTitle || ""}`,
                            url: window.location.href,
                          })
                        }
                      }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>

                  {statusDetails?.status !== false ? (
                      <div className="flex flex-col items-end gap-2">
                        <Button disabled variant="outline" className="px-6 bg-white">
                          <Badge variant="secondary" className="mr-2 bg-green-100 text-green-800">
                            ✓
                          </Badge>
                          Applied
                        </Button>

                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 mb-1">Application Status</span>
                          {statusDetails?.status === "scheduled" ? (
                              <Button
                                  onClick={() => router.push(`/job-seeker/machine-task/${jobId}`)}
                                  className="whitespace-nowrap"
                              >
                                Next Test Assigned
                              </Button>
                          ) : (
                              <Badge variant="secondary" className={`${getBadgeClass(statusDetails?.status)} px-3 py-1.5`}>
                                {statusDetails?.state[statusDetails?.state.length - 1]?.status?.toUpperCase()}
                              </Badge>
                          )}
                        </div>
                      </div>
                  ) : (
                      statusDetails?.message !== "not a job-seeker" && (
                          <Button
                              onClick={handleJobApply}
                              disabled={isApplying}
                              className="px-8 py-6 rounded-full bg-primary hover:bg-primary-700 text-white"
                          >
                            {isApplying ? (
                                <>
                                  <span className="mr-2">Applying</span>
                                  <div className="h-4 w-4 animate-spin  rounded-full border-2 border-current border-t-transparent" />
                                </>
                            ) : (
                                "Apply Now"
                            )}
                          </Button>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white">
            <div className="flex items-center gap-4">
              <div className="bg-primary-50 p-3 rounded-full">
                <BriefcaseIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Job Type</p>
                <p className="font-semibold text-gray-900">
                  {jobDetails?.employmentTypes
                      ?.map((typeItem) => typeItem.type.replace("_", " "))
                      .reverse()
                      .join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Salary Range</p>
                <p className="font-semibold text-gray-900">
                  {formatSalary(jobDetails!.salaryMin, jobDetails!.salaryMax)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-violet-50 p-3 rounded-full">
                <LocateIcon className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Location</p>
                <p className="font-semibold text-gray-900">{jobDetails!.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Posted On</p>
                <p className="font-semibold text-gray-900">{dateStr(jobDetails!.createdAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        {jobDetails && <MainContent jobDetails={jobDetails} />}
      </div>
  )
}

export default Page
