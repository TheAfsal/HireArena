"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  ArrowLeft,
  GitBranch,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { tasks } from "../../data/task";
import {
  fetchMachineTaskDetails,
  startMachineTask,
  submitMachineTask,
} from "@/app/api/interview";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

type Task = {
  id: string;
  title: string;
  category: string;
  description: string;
  hoursToComplete: string;
  startTime?: string;
  requirements: { id: string; machineTaskId: string; requirement: string }[];
  evaluationCriteria: { id: string; machineTaskId: string; criteria: string }[];
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { jobId, taskId } = useParams<{ jobId: string; taskId: string }>();

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [taskStarted, setTaskStarted] = useState(false);

  const {
    data: task,
    isLoading,
    error,
  } = useQuery<Task>({
    queryKey: ["machine_task_detail", taskId],
    queryFn: () => fetchMachineTaskDetails(taskId),
    enabled: !!taskId,
  });

  useEffect(() => {
    if (task && task.startTime) {
      setTaskStarted(true);

      // Convert hoursToComplete to milliseconds
      const timeLimit = parseInt(task.hoursToComplete) * 60 * 60 * 1000;

      // Calculate the end time based on the server-provided start time
      const startTimeMs = new Date(task.startTime).getTime();
      const endTime = startTimeMs + timeLimit;

      // Set up timer
      const updateTimer = () => {
        const remaining = Math.max(0, endTime - Date.now());
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          clearInterval(timerInterval);
        }
      };

      // Initialize timer immediately
      updateTimer();

      // Set interval to update timer every second
      const timerInterval = setInterval(updateTimer, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [task]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Loading task details...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        Task not found
      </div>
    );
  }

  const startTask = async () => {
    await startMachineTask(taskId);
    const startTime = Date.now();
    localStorage.setItem(`task_${taskId}_start`, startTime.toString());
    setTaskStarted(true);

    const timeLimit = parseInt(task.hoursToComplete) * 60 * 60 * 1000;
    setTimeRemaining(timeLimit);

    const timer = setInterval(() => {
      const endTime = startTime + timeLimit;
      const remaining = Math.max(0, endTime - Date.now());
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return "Time expired";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge>Machine Task</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {task.hoursToComplete} hour time limit
            </div>
          </div>
        </div>

        {taskStarted ? (
          <div
            className={`flex items-center gap-2 text-lg font-semibold ${
              timeRemaining && timeRemaining < 30 * 60 * 1000
                ? "text-red-500"
                : ""
            }`}
          >
            <Clock className="h-5 w-5" />
            {timeRemaining !== null
              ? formatTimeRemaining(timeRemaining)
              : "Time expired"}
          </div>
        ) : (
          <Button onClick={startTask}>Start Task</Button>
        )}
      </div>

      <Tabs defaultValue="description">
        <TabsList className="mb-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Description</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: task.description }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
              <CardDescription>
                Your submission must meet these requirements to pass
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {task.requirements.map((req: any, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{req.requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>
                How your submission will be evaluated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {task.evaluationCriteria.map((c: any, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{c.criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Solution</CardTitle>
              <CardDescription>
                {timeRemaining && timeRemaining > 0
                  ? "Provide the GitHub URL to your completed task"
                  : "Time has expired for this task"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeRemaining && timeRemaining > 0 ? (
                <SubmissionForm taskId={taskId} jobId={jobId} />
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  <p>
                    The time limit for this task has expired. You can no longer
                    submit a solution.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Repository Requirements:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Your repository must be public</li>
                  <li>Include a README.md with setup instructions</li>
                  <li>Ensure the main branch contains your final solution</li>
                  <li>Do not include node_modules or build directories</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Code Quality:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Code should be well-organized and commented</li>
                  <li>Follow best practices for the technologies used</li>
                  <li>Include appropriate error handling</li>
                  <li>
                    Ensure the application is responsive and user-friendly
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SubmissionForm({ taskId, jobId }: { taskId: string; jobId: string }) {
  const router = useRouter();
  const [githubUrl, setGithubUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!githubUrl) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (!githubRegex.test(githubUrl)) {
      setError(
        "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)"
      );
      return;
    }

    setIsSubmitting(true);

    let response = await submitMachineTask(taskId, githubUrl, jobId);
    console.log(response);
    toast({
      title: "Success",
      description: "Machine task completed successfully",
    });
    router.push(`/job-seeker/machine-task/${jobId}/task/${taskId}/results`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-muted-foreground" />
          <label htmlFor="github-url" className="font-medium">
            GitHub Repository URL
          </label>
        </div>
        <input
          id="github-url"
          type="text"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/username/repository"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-muted-foreground">
          Enter the full URL to your public GitHub repository containing your
          solution
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Solution"}
      </Button>
    </form>
  );
}
