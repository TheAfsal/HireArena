import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CheckCircle2, FileText, GraduationCap, ListChecks, Star, Briefcase, Clock } from "lucide-react"
import {JobDetails} from "@/app/jobs/[jobId]/page";

const MainContent = ({ jobDetails }: { jobDetails: JobDetails }) => {
  return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content - 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-8">
          {/* Description */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary-50 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <CardTitle>Job Description</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{jobDetails?.jobDescription}</p>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full">
                  <ListChecks className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>Key Responsibilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{jobDetails?.responsibilities}</p>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-full">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle>Qualifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{jobDetails?.qualifications}</p>
            </CardContent>
          </Card>

          {/* Nice to Have */}
          {jobDetails?.niceToHave && (
              <Card className="overflow-hidden border-none shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500"></div>
                <CardHeader className="pb-3 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-50 p-2 rounded-full">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <CardTitle>Nice to Have</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{jobDetails.niceToHave}</p>
                </CardContent>
              </Card>
          )}
        </div>

        {/* Sidebar - 4 columns on large screens */}
        <div className="lg:col-span-4 space-y-6">
          {/* Categories */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-violet-400 to-purple-500"></div>
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-violet-50 p-2 rounded-full">
                  <Briefcase className="h-5 w-5 text-violet-600" />
                </div>
                <CardTitle className="text-base">Job Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobDetails?.categories.map((category) => (
                    <Badge
                        key={category.name}
                        variant="secondary"
                        className="px-3 py-1.5 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors border-0"
                    >
                      {category.name}
                    </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Required Skills */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-sky-400 to-blue-500"></div>
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-sky-50 p-2 rounded-full">
                  <Award className="h-5 w-5 text-sky-600" />
                </div>
                <CardTitle className="text-base">Required Skills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobDetails?.requiredSkills.map((skill) => (
                    <Badge
                        key={skill.name}
                        variant="outline"
                        className="px-3 py-1.5 border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
                    >
                      {skill.name}
                    </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          {jobDetails?.benefits && jobDetails.benefits.length > 0 && (
              <Card className="overflow-hidden border-none shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <CardHeader className="pb-3 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-base">Benefits & Perks</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    {jobDetails?.benefits.map((benefit, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-3 p-2 rounded-md bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-green-800">{benefit.title}</span>
                        </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
          )}

          {/* Test Options */}
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-red-500"></div>
            <CardHeader className="pb-3 pt-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-base">Assessment Process</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(jobDetails?.testOptions || {}).map(([test, isRequired]) =>
                    isRequired ? (
                        <div
                            key={test}
                            className="flex items-center gap-3 p-3 rounded-md bg-orange-50 hover:bg-orange-100 transition-colors"
                        >
                          <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
                          <span className="text-sm font-medium text-orange-800">{test}</span>
                        </div>
                    ) : null,
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default MainContent
