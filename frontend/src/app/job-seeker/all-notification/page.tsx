"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Bell,
  BellOff,
  CheckCircle,
  Filter,
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  fetchCandidateNotifications,
  markNotificationAsRead,
} from "@/app/api/notification";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  relatedId: string;
}

const NOTIFICATIONS_PER_PAGE = 10;

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const router = useRouter();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchCandidateNotifications(
          currentPage + 1,
          NOTIFICATIONS_PER_PAGE
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [currentPage]);

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

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
      toast.error("Could not mark all notifications as read");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600"></div>
          <p className="text-slate-600 font-medium">
            Loading your notifications...
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
          <div className="flex items-center gap-4">
            <Link href="/job-seeker">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-violet-100 hover:text-violet-700 text-slate-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-violet-900 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="mt-1 text-slate-600">
                Stay updated on your job applications
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full border-violet-200 text-violet-700 hover:bg-violet-50"
              onClick={markAllAsRead}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
            <Link href="/job-seeker/jobs">
              <Button className="rounded-full px-6 bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white shadow-md hover:shadow-lg transition-all duration-300">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifications Card */}
        <Card className="overflow-hidden border-0 shadow-lg bg-white rounded-2xl">
          <CardHeader className="pb-2 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  All Notifications
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 border-violet-200 text-violet-700 bg-violet-50"
                >
                  <Filter className="mr-1 h-3 w-3" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
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
                  <div className="space-y-4">
                    {paginatedNotifications.map((notification, index) => (
                      <React.Fragment key={notification._id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div
                          onClick={() => handleNotificationClick(notification)}
                          className={`cursor-pointer p-4 rounded-xl flex items-start gap-4 ${
                            notification.read
                              ? "bg-slate-50"
                              : "bg-violet-50 border-l-4 border-violet-500"
                          } hover:bg-violet-100 transition-colors duration-200`}
                        >
                          <div
                            className={`p-3 rounded-full ${
                              notification.read
                                ? "bg-slate-100"
                                : "bg-violet-200"
                            } mt-1`}
                          >
                            <Bell
                              className={`h-5 w-5 ${
                                notification.read
                                  ? "text-slate-500"
                                  : "text-violet-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                notification.read
                                  ? "text-slate-700"
                                  : "text-slate-900"
                              } text-lg`}
                            >
                              {notification.message}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={`rounded-full px-2 py-0.5 text-xs ${
                                  notification.read
                                    ? "bg-slate-100 text-slate-600 border-slate-200"
                                    : "bg-violet-100 text-violet-700 border-violet-200"
                                }`}
                              >
                                {notification.read ? "Read" : "Unread"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <BellOff className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-600 mb-1">
                      No notifications
                    </p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unread" className="mt-0">
                {paginatedNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {paginatedNotifications.map((notification, index) => (
                      <React.Fragment key={notification._id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div
                          onClick={() => handleNotificationClick(notification)}
                          className="cursor-pointer p-4 rounded-xl flex items-start gap-4 bg-violet-50 border-l-4 border-violet-500 hover:bg-violet-100 transition-colors duration-200"
                        >
                          <div className="p-3 rounded-full bg-violet-200 mt-1">
                            <Bell className="h-5 w-5 text-violet-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-900 text-lg">
                              {notification.message}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="rounded-full px-2 py-0.5 text-xs bg-violet-100 text-violet-700 border-violet-200"
                              >
                                Unread
                              </Badge>
                              <Badge
                                variant="outline"
                                className="rounded-full px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                              >
                                {notification.type || "Update"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <CheckCircle className="h-12 w-12 text-emerald-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-600 mb-1">
                      No unread notifications
                    </p>
                    <p className="text-sm">You're all caught up!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="read" className="mt-0">
                {paginatedNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {paginatedNotifications.map((notification, index) => (
                      <React.Fragment key={notification._id}>
                        {index > 0 && <Separator className="my-4" />}
                        <div
                          onClick={() => handleNotificationClick(notification)}
                          className="cursor-pointer p-4 rounded-xl flex items-start gap-4 bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                        >
                          <div className="p-3 rounded-full bg-slate-100 mt-1">
                            <Bell className="h-5 w-5 text-slate-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-700 text-lg">
                              {notification.message}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="rounded-full px-2 py-0.5 text-xs bg-slate-100 text-slate-600 border-slate-200"
                              >
                                Read
                              </Badge>
                              <Badge
                                variant="outline"
                                className="rounded-full px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                              >
                                {notification.type || "Update"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <BellOff className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-lg font-medium text-slate-600 mb-1">
                      No read notifications
                    </p>
                    <p className="text-sm">Check back later!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-slate-500">
              Showing {paginatedNotifications.length} of{" "}
              {filteredNotifications.length} notifications
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                className="rounded-full h-9 px-4 border-violet-200 text-violet-700 hover:bg-violet-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm font-medium text-slate-700">
                Page {currentPage + 1} of {Math.max(1, totalPages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages - 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                className="rounded-full h-9 px-4 border-violet-200 text-violet-700 hover:bg-violet-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
