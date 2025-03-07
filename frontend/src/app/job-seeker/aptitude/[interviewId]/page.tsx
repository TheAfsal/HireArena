"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";

function Home() {
  const { interviewId } = useParams<{ interviewId: string }>();

  return (
    <div className="container bg-amber-400 mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          TechHire
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Welcome to our online aptitude assessment platform. This test will
          evaluate your logical reasoning, problem-solving, and analytical
          skills.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 w-full max-w-4xl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Test Duration
              </CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">30 min</div>
              <p className="text-sm text-muted-foreground">
                Time limit for completion
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Questions</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">25</div>
              <p className="text-sm text-muted-foreground">
                Multiple choice questions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Passing Score
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">70%</div>
              <p className="text-sm text-muted-foreground">
                Minimum score to qualify
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-[700px] rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Instructions:</h2>
          <ul className="list-disc pl-5 space-y-2 text-left">
            <li>You have 30 minutes to complete the test.</li>
            <li>There are 25 multiple-choice questions.</li>
            <li>Each question has only one correct answer.</li>
            <li>
              You can navigate between questions using the question panel.
            </li>
            <li>You can mark questions for review and return to them later.</li>
            <li>The test will automatically submit when the time expires.</li>
            <li>
              Ensure you have a stable internet connection before starting.
            </li>
          </ul>
        </div>

        <Link
          href={`/job-seeker/aptitude/${interviewId}/test`}
          className="w-full max-w-xs"
        >
          <Button size="lg" className="w-full">
            Start Test
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
