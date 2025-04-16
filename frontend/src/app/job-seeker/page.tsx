"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DonutChart from "./components/donut-chart";
import { RootState } from "@/redux/store";
import { fetchDashboardDataForCandidate } from "@/app/api/job-seeker";

interface JobDetails {
  jobId: string;
  title: string;
  testOptions: string;
  description: string;
}

interface ApplicationState {
  roundType: string;
  status: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  aptitudeTestResultId?: string;
}

interface Application {
  _id: string;
  jobId: string;
  candidateId: string;
  state: ApplicationState[];
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  jobDetails: JobDetails;
}

const CandidateDashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchDashboardDataForCandidate();
        setData(response);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  console.log(data);

  // Calculate stats for donut chart
  const statusCounts = data.reduce((acc, app) => {
    const status = app.state[app.state.length - 1]?.status || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalApplications = data.length;
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    value: (count / totalApplications) * 100 || 0,
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color:
      status === "failed"
        ? "rgb(239, 68, 68)"
        : status === "passed"
        ? "rgb(34, 197, 94)"
        : "rgb(99, 102, 241)",
  }));

  // Filter upcoming interviews
  const upcomingInterviews = data
    .flatMap((app) =>
      app.state
        .filter(
          (state) =>
            ["Technical Interview", "Behavioral Interview"].includes(
              state.roundType
            ) && new Date(state.scheduledAt) > new Date()
        )
        .map((state) => ({
          jobTitle: app.jobDetails.title,
          roundType: state.roundType,
          scheduledAt: state.scheduledAt,
        }))
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {/* @ts-ignore */}
            Good morning, {auth.user?.fullName || "Candidate"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your job applications and upcoming interviews
          </p>
        </div>
        <Link href="/job-seeker/jobs">
          <Button
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Browse Jobs
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Jobs Applied
          </h3>
          <div className="flex items-end gap-4 mt-4">
            <span className="text-4xl font-bold text-indigo-600">
              {data.length}
            </span>
            <CalendarDays className="w-8 h-8 text-indigo-200" />
          </div>
        </Card>

        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Application Status
          </h3>
          <div className="flex items-center justify-between mt-4">
            <DonutChart
              data={
                chartData.length > 0
                  ? chartData
                  : [
                      {
                        value: 100,
                        label: "No Data",
                        color: "rgb(229, 231, 235)",
                      },
                    ]
              }
            />
            <div className="space-y-2">
              {chartData.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {Math.round(item.value)}% {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/job-seeker/my-applications">
            <Button
              variant="link"
              className="mt-4 p-0 text-indigo-600 hover:text-indigo-800"
            >
              View All Applications
            </Button>
          </Link>
        </Card>

        <Card className="p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-1 sm:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Upcoming Interviews
            </h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {upcomingInterviews.length > 0 ? (
            upcomingInterviews.map((interview, index) => (
              <div
                key={index}
                className="bg-indigo-50 p-4 rounded-lg flex items-center gap-3 mb-4"
              >
                <Avatar>
                  <AvatarFallback className="bg-indigo-500 text-white">
                    {interview.roundType[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">
                    {interview.jobTitle}
                  </div>
                  <div className="text-sm text-gray-600">
                    {interview.roundType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {interview.scheduledAt}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No upcoming interviews
            </div>
          )}
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-6">
          Recent Applications
        </h3>
        <div className="space-y-4">
          {data.length > 0 ? (
            data.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {app.jobDetails.title[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {app.jobDetails.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {app.jobDetails.description.slice(0, 50)}...
                    </div>
                    <div className="text-sm text-gray-500">
                      Applied: {app.createdAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      app.state[app.state.length - 1]?.status === "failed"
                        ? "destructive"
                        : "default"
                    }
                    className="capitalize"
                  >
                    {app.state[app.state.length - 1]?.status || "Pending"}
                  </Badge>
                  {/* <Link href={`/applications/${app._id}`}>
                    <Button variant="outline" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                      View
                    </Button>
                  </Link> */}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No applications found
            </div>
          )}
        </div>
        <Link href="/job-seeker/my-applications">
          <Button
            variant="link"
            className="mt-6 p-0 text-indigo-600 hover:text-indigo-800"
          >
            View all applications
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default CandidateDashboard;
