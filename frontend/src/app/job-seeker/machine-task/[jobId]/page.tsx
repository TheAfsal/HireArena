"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Code, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchMachineTaskByJobId } from "@/app/api/interview";

export default function Home() {
  const { jobId } = useParams<{ jobId: string }>();

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["machine_task", jobId],
    queryFn: () => fetchMachineTaskByJobId(jobId),
    enabled: !!jobId, // Ensure query only runs if jobId exists
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl">Loading machine task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-red-500">Failed to load machine task.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Machine Task Evaluation
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Welcome to our machine task evaluation platform. Complete the assigned
          task and submit your GitHub repository for assessment.
        </p>

        {/* Machine Task Information */}
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Assigned Machine Task</h2>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{task.title}</CardTitle>
                <Badge>Machine Task</Badge>
              </div>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{task.hoursToComplete} hour time limit</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/job-seeker/machine-task/${jobId}/task/${task._id}`}
                className="w-full"
              >
                <Button className="w-full">View Task Details</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="max-w-[700px] rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">How It Works:</h2>
          <ol className="list-decimal pl-5 space-y-2 text-left">
            <li>Select a task from the available options</li>
            <li>Review the task requirements and acceptance criteria</li>
            <li>Complete the task within the specified time limit</li>
            <li>Push your code to a public GitHub repository</li>
            <li>Submit the GitHub URL for evaluation</li>
            <li>Receive feedback on your submission</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
