"use client";
import type React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  CalendarIcon,
  Clock,
  DollarSign,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock4,
  Filter,
  Search,
  X,
} from "lucide-react";
import { type IJob } from "../page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { error } from "console";
import { fetchJobDetails } from "@/app/api/job";
import { fetchJobApplications } from "@/app/api/interview";
import {
  ICandidate,
  IInterview,
  RoundType,
  RoundStatus,
  JobStatus,
} from "@/Types/job.types";
import { fetchJobSeekerProfileByAdmin } from "@/app/api/profile";

const JobDashboardPage: React.FC = () => {
  const { jobId } = useParams();
  const [selectedApplication, setSelectedApplication] =
    useState<IInterview | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roundTypeFilter, setRoundTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const {
    data: job,
    isLoading: isJobLoading,
    error: jobError,
  } = useQuery<IJob>({
    queryKey: ["job_details", jobId],
    queryFn: () => fetchJobDetails(jobId as string),
  });

  console.log(jobError, job);

  const {
    data: applications,
    isLoading: isApplicationsLoading,
    error: applicationsError,
  } = useQuery<IInterview[]>({
    queryKey: ["job_applications", jobId],
    queryFn: () => fetchJobApplications(jobId as string),
  });

  const handleViewApplicationDetails = async (application: IInterview) => {
    setSelectedApplication(application);

    const candidate = await fetchJobSeekerProfileByAdmin(
      application.candidateId
    );
    console.log(candidate);
    setSelectedCandidate(candidate);

    setIsDialogOpen(true);
  };

  const getLatestRoundStatus = (state: IInterview["state"]) => {
    return state[state.length - 1]?.status || "Pending";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case RoundStatus.Completed:
        return "bg-green-100 text-green-800";
      case RoundStatus.Failed:
        return "bg-red-100 text-red-800";
      case RoundStatus.Pending:
        return "bg-yellow-100 text-yellow-800";
      case RoundStatus.Scheduled:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case RoundStatus.Completed:
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case RoundStatus.Failed:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case RoundStatus.Pending:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case RoundStatus.Scheduled:
        return <Clock4 className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredApplications = applications?.filter((application) => {
    if (statusFilter !== "all") {
      const latestStatus = getLatestRoundStatus(application.state);
      if (latestStatus !== statusFilter) return false;
    }

    if (roundTypeFilter !== "all") {
      const hasRoundType = application.state.some(
        (state) => state.roundType === roundTypeFilter
      );
      if (!hasRoundType) return false;
    }

    if (dateFrom) {
      const applicationDate = new Date(application.createdAt);
      if (applicationDate < dateFrom) return false;
    }

    if (dateTo) {
      const nextDay = new Date(dateTo);
      nextDay.setDate(nextDay.getDate() + 1);
      const applicationDate = new Date(application.createdAt);
      if (applicationDate > nextDay) return false;
    }

    if (searchQuery) {
      return application.candidateId
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }

    return true;
  });

  if (isJobLoading || isApplicationsLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading job dashboard...</div>
      </div>
    );
  }

  if (jobError || applicationsError) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Failed to load job data. Please try again later.
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Job not found</div>
      </div>
    );
  }

  // Generate chart data
  const applicationStatusData = [
    {
      name: "Completed",
      value:
        applications?.filter(
          (app) => getLatestRoundStatus(app.state) === RoundStatus.Completed
        ).length || 0,
      color: "#4ade80",
    },
    {
      name: "Failed",
      value:
        applications?.filter(
          (app) => getLatestRoundStatus(app.state) === RoundStatus.Failed
        ).length || 0,
      color: "#f87171",
    },
    {
      name: "Pending",
      value:
        applications?.filter(
          (app) => getLatestRoundStatus(app.state) === RoundStatus.Pending
        ).length || 0,
      color: "#facc15",
    },
    {
      name: "Scheduled",
      value:
        applications?.filter(
          (app) => getLatestRoundStatus(app.state) === RoundStatus.Scheduled
        ).length || 0,
      color: "#60a5fa",
    },
  ];

  // Generate applications over time data (last 30 days)
  const applicationsOverTimeData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      applications: Math.floor(Math.random() * 5), // Random number of applications per day
    };
  });

  // Generate interview stage data
  const interviewStageData = [
    {
      name: RoundType.AptitudeTest,
      completed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.AptitudeTest &&
              s.status === RoundStatus.Completed
          )
        ).length || 0,
      failed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.AptitudeTest &&
              s.status === RoundStatus.Failed
          )
        ).length || 0,
      pending:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.AptitudeTest &&
              (s.status === RoundStatus.Pending ||
                s.status === RoundStatus.Scheduled)
          )
        ).length || 0,
    },
    {
      name: RoundType.MachineTask,
      completed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.MachineTask &&
              s.status === RoundStatus.Completed
          )
        ).length || 0,
      failed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.MachineTask &&
              s.status === RoundStatus.Failed
          )
        ).length || 0,
      pending:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.MachineTask &&
              (s.status === RoundStatus.Pending ||
                s.status === RoundStatus.Scheduled)
          )
        ).length || 0,
    },
    {
      name: RoundType.TechnicalInterview,
      completed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.TechnicalInterview &&
              s.status === RoundStatus.Completed
          )
        ).length || 0,
      failed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.TechnicalInterview &&
              s.status === RoundStatus.Failed
          )
        ).length || 0,
      pending:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.TechnicalInterview &&
              (s.status === RoundStatus.Pending ||
                s.status === RoundStatus.Scheduled)
          )
        ).length || 0,
    },
    {
      name: RoundType.HrInterview,
      completed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.HrInterview &&
              s.status === RoundStatus.Completed
          )
        ).length || 0,
      failed:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.HrInterview &&
              s.status === RoundStatus.Failed
          )
        ).length || 0,
      pending:
        applications?.filter((app) =>
          app.state.some(
            (s) =>
              s.roundType === RoundType.HrInterview &&
              (s.status === RoundStatus.Pending ||
                s.status === RoundStatus.Scheduled)
          )
        ).length || 0,
    },
  ];

  // Generate candidate skills data
  const candidateSkillsData = [
    { name: "JavaScript", count: 8 },
    { name: "React", count: 7 },
    { name: "TypeScript", count: 5 },
    { name: "Node.js", count: 4 },
    { name: "CSS", count: 6 },
    { name: "HTML", count: 6 },
    { name: "MongoDB", count: 3 },
    { name: "GraphQL", count: 2 },
  ];

  const pages = [1, 2, 3, 4, 5];
  const currentPage = 1;
  return (
    <div className="h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            ← Back to Jobs
          </Button>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {job.jobTitle}
                </h1>
                <p className="text-gray-600 mt-1">{job.company}</p>
              </div>
              <Badge
                variant={
                  job.status === JobStatus.Open ? "default" : "secondary"
                }
                className="text-sm"
              >
                {/* {job.status} */}
                open
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-500 mr-2" />
                {job.employmentTypes.map((item) => (
                  <span>{item.type}</span>
                ))}
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                <span>{`${job.salaryMin} - ${job.salaryMax}`}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>
                  Deadline: {new Date(job.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            {/* <TabsTrigger value="statistics">Statistics</TabsTrigger> */}
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="applications">
              Applications ({applications?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader className="space-y-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>All Applications</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {(statusFilter !== "all" ||
                        roundTypeFilter !== "all" ||
                        dateFrom ||
                        dateTo ||
                        searchQuery) && (
                        <Badge variant="secondary" className="ml-1">
                          {[
                            statusFilter !== "all" ? 1 : 0,
                            roundTypeFilter !== "all" ? 1 : 0,
                            dateFrom || dateTo ? 1 : 0,
                            searchQuery ? 1 : 0,
                          ].reduce((a, b) => a + b, 0)}
                        </Badge>
                      )}
                    </Button>
                    {(statusFilter !== "all" ||
                      roundTypeFilter !== "all" ||
                      dateFrom ||
                      dateTo ||
                      searchQuery) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setStatusFilter("all");
                          setRoundTypeFilter("all");
                          setDateFrom(undefined);
                          setDateTo(undefined);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {showFilters && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search by Candidate ID</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value={RoundStatus.Completed}>
                            Completed
                          </SelectItem>
                          <SelectItem value={RoundStatus.Failed}>
                            Failed
                          </SelectItem>
                          <SelectItem value={RoundStatus.Pending}>
                            Pending
                          </SelectItem>
                          <SelectItem value={RoundStatus.Scheduled}>
                            Scheduled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="roundType">Round Type</Label>
                      <Select
                        value={roundTypeFilter}
                        onValueChange={setRoundTypeFilter}
                      >
                        <SelectTrigger id="roundType">
                          <SelectValue placeholder="Select round type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Rounds</SelectItem>
                          {Object.values(RoundType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Application Date</Label>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateFrom && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFrom ? format(dateFrom, "PPP") : "From date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={setDateFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateTo && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateTo ? format(dateTo, "PPP") : "To date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateTo}
                              onSelect={setDateTo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Round
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scheduled Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications?.map((application) => (
                        <tr key={application._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex justify-left items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  //@ts-ignore
                                  src={application?.candidate?.image}
                                  alt="@shadcn"
                                />
                                <AvatarFallback>
                                  {
                                    //@ts-ignore
                                    application?.candidate?.fullName[0]
                                  }
                                </AvatarFallback>
                              </Avatar>
                              {
                                //@ts-ignore
                                application?.candidate?.fullName
                              }
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                getLatestRoundStatus(application.state)
                              )}`}
                            >
                              {getLatestRoundStatus(application.state)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.state[application.state.length - 1]
                              ?.roundType || "Not Started"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {application.scheduledAt
                              ? new Date(
                                  application.scheduledAt
                                ).toLocaleDateString()
                              : "Not Scheduled"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="ghost"
                              onClick={() =>
                                handleViewApplicationDetails(application)
                              }
                              className="text-primary hover:text-primary/80"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredApplications?.length === 0 && (
                  <div className="text-center py-10">
                    {applications && applications.length > 0 ? (
                      <>
                        <Filter className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          No matching applications
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Try adjusting your filters to find what you're looking
                          for
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setStatusFilter("all");
                            setRoundTypeFilter("all");
                            setDateFrom(undefined);
                            setDateTo(undefined);
                            setSearchQuery("");
                          }}
                        >
                          Clear all filters
                        </Button>
                      </>
                    ) : (
                      <>
                        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">
                          No applications yet
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Applications for this job will appear here
                        </p>
                      </>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-center mt-6 space-x-2">
                  <Button variant="normal" disabled={currentPage === 1}>
                    Previous
                  </Button>

                  {pages.map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    disabled={currentPage === pages.length}
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {/* <p>{job.jobDescription}</p> */}

                  <h3 className="text-lg font-medium mt-6">Requirements</h3>
                  {/* <ul className="mt-2 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul> */}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium">Job Details</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                          {job.employmentTypes.map((item) => (
                            <span>{item.type}</span>
                          ))}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            Experience: {job.experience}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            Location: {job.location}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            Salary: {`${job.salaryMin} - ${job.salaryMax}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium">Timeline</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            Posted:{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            Deadline:{" "}
                            {new Date(job.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            Applications: {job.applicationsCount} Counting...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
            </DialogHeader>

            {selectedApplication && selectedCandidate && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-4">
                      Candidate Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {selectedCandidate.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedCandidate.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedCandidate.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Years of Experience
                        </p>
                        <p className="font-medium">
                          {selectedCandidate.yearsOfExperience}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Skills</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedCandidate.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Current Job Title
                        </p>
                        <p className="font-medium">
                          {selectedCandidate.currentJobTitle}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {selectedCandidate.location}
                        </p>
                      </div>
                      <div className="pt-2">
                        {selectedCandidate.resume ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              window.open(selectedCandidate.resume, "_blank")
                            }
                          >
                            View Resume
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={true}
                          >
                            Resume not available
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-medium text-lg mb-4">
                    Interview Progress
                  </h3>
                  <div className="space-y-4">
                    {selectedApplication.state.map((round, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              {getStatusIcon(round.status)}
                              <h4 className="font-medium ml-2">
                                {round.roundType}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {round.scheduledAt
                                ? `Scheduled for ${new Date(
                                    round.scheduledAt
                                  ).toLocaleString()}`
                                : "Not scheduled yet"}
                            </p>
                          </div>
                          <Badge className={getStatusBadgeColor(round.status)}>
                            {round.status}
                          </Badge>
                        </div>

                        {round.remarks && (
                          <div className="mt-3 text-sm">
                            <p className="text-gray-500">Remarks:</p>
                            <p className="mt-1">{round.remarks}</p>
                          </div>
                        )}

                        <div className="mt-3 flex justify-end gap-2">
                          {/* {round.status === RoundStatus.Pending && (
                            <Button size="sm" variant="outline">
                              Schedule
                            </Button>
                          )}
                          {round.status === RoundStatus.Scheduled && (
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button> */}
                        </div>
                      </div>
                    ))}

                    {/* <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline">Add Interview Round</Button>
                      <Button>Update Status</Button>
                    </div> */}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JobDashboardPage;

// Dummy data functions
// const fetchJobDetails = (jobId: string): Promise<IJob> => {
//   // This would be an API call in a real application
//   const jobs = [
//     {
//       _id: "988e84c8-5c06-48d0-9e6b-2b1cc63cdbe6",
//       jobTitle: "Senior Frontend Developer",
//       company: "TechCorp Inc.",
//       location: "San Francisco, CA",
//       employmentTypes: [
//         {
//           type: JobType.FullTime,
//         },
//       ],
//       experience: "3-5 years",
//       salary: "$120,000 - $150,000",
//       description:
//         "We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have strong experience with React, TypeScript, and modern frontend development practices. You will be responsible for building and maintaining user interfaces for our web applications.",
//       requirements: [
//         "3+ years of experience with React and TypeScript",
//         "Strong understanding of HTML, CSS, and JavaScript",
//         "Experience with state management libraries (Redux, MobX, etc.)",
//         "Familiarity with responsive design and cross-browser compatibility",
//         "Knowledge of frontend testing frameworks",
//         "Bachelor's degree in Computer Science or related field",
//       ],
//       applicationsCount: 12,
//       status: JobStatus.Open,
//       postedAt: new Date("2025-04-10"),
//       deadline: new Date("2025-05-10"),
//       createdAt: new Date("2025-04-10"),
//       updatedAt: new Date("2025-04-10"),
//     },
//     {
//       _id: "d98881c3-bab3-4c01-9d5a-6fb285f66154",
//       jobTitle: "Backend Engineer",
//       company: "TechCorp Inc.",
//       location: "Remote",
//       employmentTypes: [
//         {
//           type: JobType.Remote,
//         },
//       ],
//       experience: "2-4 years",
//       salary: "$100,000 - $130,000",
//       description:
//         "We are seeking a Backend Engineer to develop and maintain our server-side applications. The ideal candidate will have experience with Node.js, Express, and database technologies. You will work closely with frontend developers to integrate user-facing elements with server-side logic.",
//       requirements: [
//         "2+ years of experience with Node.js and Express",
//         "Experience with MongoDB or other NoSQL databases",
//         "Knowledge of RESTful API design",
//         "Familiarity with AWS or other cloud platforms",
//         "Understanding of security best practices",
//         "Experience with CI/CD pipelines",
//       ],
//       applicationsCount: 8,
//       status: JobStatus.Open,
//       postedAt: new Date("2025-04-15"),
//       deadline: new Date("2025-05-15"),
//       createdAt: new Date("2025-04-15"),
//       updatedAt: new Date("2025-04-15"),
//     },
//     {
//       _id: "2d19a497-041d-42b4-901e-fe190dfede71",
//       jobTitle: "UI/UX Designer",
//       company: "TechCorp Inc.",
//       location: "New York, NY",
//       employmentTypes: [
//         {
//           type: JobType.FullTime,
//         },
//       ],
//       experience: "2+ years",
//       salary: "$90,000 - $120,000",
//       description:
//         "We are looking for a talented UI/UX Designer to create amazing user experiences. The ideal candidate should have a strong portfolio demonstrating their design skills and user-centered approach.",
//       requirements: [
//         "2+ years of experience in UI/UX design",
//         "Proficiency in design tools like Figma, Adobe XD, or Sketch",
//         "Strong portfolio showcasing UI/UX projects",
//         "Understanding of user research and testing methodologies",
//         "Knowledge of design systems and component libraries",
//         "Excellent communication skills",
//       ],
//       applicationsCount: 5,
//       status: JobStatus.Open,
//       postedAt: new Date("2025-04-18"),
//       deadline: new Date("2025-05-18"),
//       createdAt: new Date("2025-04-18"),
//       updatedAt: new Date("2025-04-18"),
//     },
//   ];

//   const job = jobs.find((j) => j._id === jobId);

//   if (!job) {
//     return Promise.reject(new Error("Job not found"));
//   }

//   return Promise.resolve(job);
// };

// const fetchJobApplications = (jobId: string): Promise<IInterview[]> => {
//   const applications = [
//     {
//       _id: "6809d29a2040aa690bfef087",
//       jobId: "988e84c8-5c06-48d0-9e6b-2b1cc63cdbe6",
//       candidateId: "d0105245-3de5-41df-9ce7-407b50c92d9b",
//       state: [
//         {
//           roundType: RoundType.AptitudeTest,
//           status: RoundStatus.Failed,
//           scheduledAt: new Date("2025-04-24T05:56:50.124Z"),
//           createdAt: new Date("2025-04-24T05:56:50.124Z"),
//           updatedAt: new Date("2025-04-24T05:56:50.124Z"),
//           remarks: "Candidate did not meet the minimum score requirement.",
//         },
//       ],
//       scheduledAt: new Date("2025-04-24T05:56:42.292Z"),
//       createdAt: new Date("2025-04-24T05:56:42.292Z"),
//       updatedAt: new Date("2025-04-24T05:57:08.513Z"),
//     },
//     {
//       _id: "6809c7412040aa690bfef071",
//       jobId: "988e84c8-5c06-48d0-9e6b-2b1cc63cdbe6",
//       candidateId: "a7105245-3de5-41df-9ce7-407b50c92d9c",
//       state: [
//         {
//           roundType: RoundType.AptitudeTest,
//           status: RoundStatus.Completed,
//           scheduledAt: new Date("2025-04-24T05:08:25.131Z"),
//           createdAt: new Date("2025-04-24T05:08:25.131Z"),
//           updatedAt: new Date("2025-04-24T05:08:25.131Z"),
//           remarks: "Candidate performed well in the aptitude test.",
//         },
//         {
//           roundType: RoundType.MachineTask,
//           status: RoundStatus.Pending,
//           createdAt: new Date("2025-04-24T05:10:45.503Z"),
//           updatedAt: new Date("2025-04-24T05:10:45.503Z"),
//           scheduledAt: new Date("2025-04-24T05:10:45.508Z"),
//         },
//       ],
//       scheduledAt: new Date("2025-04-24T05:08:17.169Z"),
//       createdAt: new Date("2025-04-24T05:08:17.169Z"),
//       updatedAt: new Date("2025-04-24T05:10:45.506Z"),
//     },
//     {
//       _id: "6808a02e0fe7de3249cc44cc",
//       jobId: "988e84c8-5c06-48d0-9e6b-2b1cc63cdbe6",
//       candidateId: "b8105245-3de5-41df-9ce7-407b50c92d9d",
//       state: [
//         {
//           roundType: RoundType.TechnicalInterview,
//           status: RoundStatus.Scheduled,
//           scheduledAt: new Date("2025-04-23T18:30:00.000Z"),
//           createdAt: new Date("2025-04-24T06:03:34.560Z"),
//           updatedAt: new Date("2025-04-24T06:03:34.560Z"),
//           videoCallLink:
//             "http://localhost:3000/job-seeker/video-call/meeting/460000f8-e5a2-4f21-8dee-b445b0df3d60",
//         },
//       ],
//       scheduledAt: new Date("2025-04-23T08:09:18.101Z"),
//       createdAt: new Date("2025-04-23T08:09:18.101Z"),
//       updatedAt: new Date("2025-04-24T06:03:34.558Z"),
//     },
//   ];

//   return Promise.resolve(applications.filter((app) => app.jobId === jobId));
// };

// const fetchCandidateDetails = (candidateId: string): Promise<ICandidate> => {
//   const candidates = [
//     {
//       _id: "d0105245-3de5-41df-9ce7-407b50c92d9b",
//       name: "John Smith",
//       email: "john.smith@example.com",
//       phone: "+1 (555) 123-4567",
//       resume: "/resumes/john-smith-resume.pdf",
//       experience: "4 years",
//       skills: ["JavaScript", "React", "TypeScript", "CSS", "HTML"],
//     },
//     {
//       _id: "a7105245-3de5-41df-9ce7-407b50c92d9c",
//       name: "Emily Johnson",
//       email: "emily.johnson@example.com",
//       phone: "+1 (555) 987-6543",
//       resume: "/resumes/emily-johnson-resume.pdf",
//       experience: "3 years",
//       skills: ["JavaScript", "React", "Redux", "Node.js", "MongoDB"],
//     },
//     {
//       _id: "b8105245-3de5-41df-9ce7-407b50c92d9d",
//       name: "Michael Chen",
//       email: "michael.chen@example.com",
//       phone: "+1 (555) 456-7890",
//       resume: "/resumes/michael-chen-resume.pdf",
//       experience: "5 years",
//       skills: ["JavaScript", "React", "TypeScript", "GraphQL", "AWS"],
//     },
//   ];

//   const candidate = candidates.find((c) => c._id === candidateId);

//   if (!candidate) {
//     return Promise.reject(new Error("Candidate not found"));
//   }

//   return Promise.resolve(candidate);
// };
