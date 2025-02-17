import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import ApplicationItem from "./components/application-item";
import DonutChart from "./components/donut-chart";

import React from "react";

const page = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Jake</h1>
          <p className="text-muted-foreground">
            Here is what's happening with your job search applications from July
            19 - July 25.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Jul 19 - Jul 25
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Total Jobs Applied</h3>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold">45</span>
            <div className="w-16 h-16 opacity-20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Jobs Applied Status</h3>
          <div className="flex items-center justify-between">
            <DonutChart
              data={[
                { value: 60, label: "Unsuitable", color: "rgb(99, 102, 241)" },
                {
                  value: 40,
                  label: "Interviewed",
                  color: "rgb(224, 231, 255)",
                },
              ]}
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[rgb(99,102,241)]" />
                <span className="text-sm">60% Unsuitable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[rgb(224,231,255)]" />
                <span className="text-sm">40% Interviewed</span>
              </div>
            </div>
          </div>
          <Button variant="link" className="mt-4 p-0">
            View All Applications
          </Button>
        </Card>

        <Card className="p-6 lg:col-span-1 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Upcomming Interviews</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Today,</span>
              <span className="text-muted-foreground">26 November</span>
            </div>

            <div className="space-y-4">
              <div className="text-muted-foreground">10:00 AM</div>
              <div className="text-muted-foreground">10:30 AM</div>
              <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                <Avatar>
                  <div className="w-10 h-10 rounded-full bg-blue-500" />
                </Avatar>
                <div>
                  <div className="font-semibold">Joe Bartmann</div>
                  <div className="text-sm text-muted-foreground">
                    HR Manager at Divvy
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground">11:00 AM</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-6">
          Recent Applications History
        </h3>
        <div className="space-y-4">
          <ApplicationItem
            logo="/placeholder.svg?height=40&width=40"
            company="Nomad"
            title="Social Media Assistant"
            location="Paris, France"
            type="Full-Time"
            date="24 July 2021"
            status="In Review"
          />
          <ApplicationItem
            logo="/placeholder.svg?height=40&width=40"
            company="Udacity"
            title="Social Media Assistant"
            location="New York, USA"
            type="Full-Time"
            date="23 July 2021"
            status="Shortlisted"
          />
          <ApplicationItem
            logo="/placeholder.svg?height=40&width=40"
            company="Packer"
            title="Social Media Assistant"
            location="Madrid, Spain"
            type="Full-Time"
            date="22 July 2021"
            status="Declined"
          />
        </div>
        <Button variant="link" className="mt-4 p-0">
          View all applications history
        </Button>
      </Card>
    </div>
  );
};

export default page;
