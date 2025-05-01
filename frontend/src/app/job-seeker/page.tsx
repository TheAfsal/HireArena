"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Bell,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DonutChart from "./components/donut-chart";
import type { RootState } from "@/redux/store";
import { fetchDashboardDataForCandidate } from "@/app/api/job-seeker";
import { markNotificationAsRead } from "@/app/api/notification";

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

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  relatedId: string;
}

const NOTIFICATIONS_PER_PAGE = 2;

const CandidateDashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchDashboardDataForCandidate();
        setData(response[0]);
        setNotifications(response[1]?.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      router.push(`/jobs/${notification.relatedId}`);
      if (!notification.read) {
        await markNotificationAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      toast.error("Could not mark notification as read");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "read") return n.read;
    if (filter === "unread") return !n.read;
    return true;
  });

  const totalPages = Math.ceil(
    filteredNotifications.length / NOTIFICATIONS_PER_PAGE
  );

  const paginatedNotifications = filteredNotifications.slice(
    currentPage * NOTIFICATIONS_PER_PAGE,
    (currentPage + 1) * NOTIFICATIONS_PER_PAGE
  );

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
        ? "#f43f5e"
        : status === "passed"
        ? "#10b981"
        : status === "pending" 
        ? "#6366f1"
        : "#f59e0b",
  }));

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "passed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "failed":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "pending":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <Clock className="h-4 w-4 text-violet-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600"></div>
          <p className="text-slate-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-violet-900 bg-clip-text text-transparent">
              Good {getTimeOfDay()},{" "}
              {
                //@ts-ignore
                auth.user?.fullName || "Candidate"
              }
            </h1>
            <p className="mt-1 text-slate-600">
              Your job search journey at a glance
            </p>
          </div>
          <Link href="/job-seeker/jobs">
            <Button className="rounded-full px-6 bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white shadow-md hover:shadow-lg transition-all duration-300">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Total Applications
              </CardTitle>
              <CardDescription className="text-slate-500">
                Your job application history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 mt-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
                  {data.length}
                </span>
                <div className="p-3 rounded-full bg-violet-100">
                  <CalendarDays className="w-6 h-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/job-seeker/my-applications">
                <Button
                  variant="ghost"
                  className="p-0 text-violet-600 hover:text-violet-800 hover:bg-transparent"
                >
                  View history <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
            <CardHeader className="pb-2 pt-6">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Application Status
              </CardTitle>
              <CardDescription className="text-slate-500">
                Overview of your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2">
                <div className="w-32 h-32">
                  <DonutChart
                    data={
                      chartData.length > 0
                        ? chartData
                        : [
                            {
                              value: 100,
                              label: "No Data",
                              color: "#e5e7eb",
                            },
                          ]
                    }
                  />
                </div>
                <div className="space-y-3">
                  {chartData.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-700 font-medium">
                        {Math.round(item.value)}% {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/job-seeker/my-applications">
                <Button
                  variant="ghost"
                  className="p-0 text-violet-600 hover:text-violet-800 hover:bg-transparent"
                >
                  View details <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Notifications */}
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl lg:col-span-1 sm:col-span-2">
            <CardHeader className="pb-2 pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Updates on your applications
                  </CardDescription>
                </div>
                <Link href="/job-seeker/all-notification">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
                  >
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger
                    value="all"
                    onClick={() => {
                      setFilter("all");
                      setCurrentPage(0);
                    }}
                    className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    onClick={() => {
                      setFilter("unread");
                      setCurrentPage(0);
                    }}
                    className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700"
                  >
                    Unread
                  </TabsTrigger>
                  <TabsTrigger
                    value="read"
                    onClick={() => {
                      setFilter("read");
                      setCurrentPage(0);
                    }}
                    className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700"
                  >
                    Read
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  {paginatedNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {paginatedNotifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`cursor-pointer p-3 rounded-xl flex items-center gap-3 ${
                            notification.read
                              ? "bg-slate-50"
                              : "bg-violet-50 border-l-4 border-violet-500"
                          } hover:bg-violet-100 transition-colors duration-200`}
                        >
                          <div
                            className={`p-2 rounded-full ${
                              notification.read
                                ? "bg-slate-100"
                                : "bg-violet-200"
                            }`}
                          >
                            <Bell
                              className={`h-4 w-4 ${
                                notification.read
                                  ? "text-slate-500"
                                  : "text-violet-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div
                              className={`font-medium ${
                                notification.read
                                  ? "text-slate-700"
                                  : "text-slate-900"
                              }`}
                            >
                              {notification.message}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p>No notifications</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="unread" className="mt-0">
                  {/* Same content structure as "all" tab but filtered for unread */}
                  {paginatedNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {paginatedNotifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className="cursor-pointer p-3 rounded-xl flex items-center gap-3 bg-violet-50 border-l-4 border-violet-500 hover:bg-violet-100 transition-colors duration-200"
                        >
                          <div className="p-2 rounded-full bg-violet-200">
                            <Bell className="h-4 w-4 text-violet-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {notification.message}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p>No unread notifications</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="read" className="mt-0">
                  {/* Same content structure as "all" tab but filtered for read */}
                  {paginatedNotifications.length > 0 ? (
                    <div className="space-y-3">
                      {paginatedNotifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className="cursor-pointer p-3 rounded-xl flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                        >
                          <div className="p-2 rounded-full bg-slate-100">
                            <Bell className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-700">
                              {notification.message}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p>No read notifications</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <div className="text-xs text-slate-500">
                {filteredNotifications.length} notification
                {filteredNotifications.length !== 1 ? "s" : ""}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage === 0}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-2xl mt-8">
          <CardHeader className="pb-2 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Recent Applications
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Your latest job applications and their status
                </CardDescription>
              </div>
              <Link href="/job-seeker/my-applications">
                <Button
                  variant="outline"
                  className="rounded-full border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
                >
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {data.length > 0 ? (
                data.slice(0, 5).map((app, index) => (
                  <React.Fragment key={app._id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-violet-100">
                          <AvatarFallback className="bg-gradient-to-br from-violet-100 to-violet-200 text-violet-700 font-semibold">
                            {app.jobDetails.title[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900 mb-1">
                            {app.jobDetails.title}
                          </div>
                          <div className="text-sm text-slate-600 line-clamp-1">
                            {app.jobDetails.description}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Applied:{" "}
                            {new Date(app.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`px-3 py-1 rounded-full border ${getStatusColor(
                            app.state[app.state.length - 1]?.status
                          )}`}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(
                              app.state[app.state.length - 1]?.status
                            )}
                            <span className="capitalize">
                              {app.state[app.state.length - 1]?.status ||
                                "Pending"}
                            </span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-lg font-medium text-slate-600 mb-1">
                    No applications yet
                  </p>
                  <p className="text-sm">Start your job search journey today</p>
                  <Link href="/job-seeker/jobs" className="mt-4 inline-block">
                    <Button className="mt-4 rounded-full bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900">
                      Browse Available Jobs
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateDashboard;
