"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Home } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAptitudeResult } from "@/app/api/interview";

export default function ResultsPage() {
  const router = useRouter();
  const { interviewId } = useParams<{ interviewId: string }>();

  const { data: result, isLoading, error } = useQuery({
    queryKey: ["aptitude_test_results", interviewId],
    queryFn: () => fetchAptitudeResult(interviewId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Results...</CardTitle>
            <CardDescription>Please wait while we fetch your results.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Results</CardTitle>
            <CardDescription>Something went wrong. Please try again later.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Home Page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { correctCount, incorrectCount, unansweredCount, scorePercentage, roundStatus } = result;

  const totalQuestions =25

  // Handle cases where no questions were answered
  const calculatedScorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  
  const isPassed = roundStatus === "passed" || calculatedScorePercentage >= 70;
  const displayPercentage = scorePercentage ?? calculatedScorePercentage;
  const displayUnanswered = Math.max(unansweredCount, 0); // Avoid negative values

  // if (totalQuestions === 0) {
  //   return (
  //     <div className="container mx-auto px-4 py-12 flex justify-center">
  //       <Card className="w-full max-w-md">
  //         <CardHeader>
  //           <CardTitle>No Test Taken</CardTitle>
  //           <CardDescription>No questions were attempted for this test.</CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Link href="/">
  //             <Button className="w-full">Go to Home Page</Button>
  //           </Link>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Test Results</h1>

        <Card className="w-full max-w-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Your Aptitude Test Score</CardTitle>
            <CardDescription>Completed on {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-7xl font-bold">{displayPercentage}%</div>
              <div className="flex items-center gap-2 text-lg font-medium">
                {isPassed ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-green-600">Passed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    <span className="text-red-600">Failed</span>
                  </>
                )}
              </div>
              <div className="text-muted-foreground">
                You scored {correctCount} out of {totalQuestions} questions correctly
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Your Score</span>
                <span>{displayPercentage}%</span>
              </div>
              <Progress value={displayPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="text-amber-600">Passing (70%)</span>
                <span>100%</span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Performance Analysis</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <div className="text-sm font-medium">Correct Answers</div>
                    <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="text-sm font-medium">Incorrect Answers</div>
                    <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3 col-span-2">
                    <div className="text-sm font-medium">Unanswered Questions</div>
                    <div className="text-2xl font-bold text-gray-600">{displayUnanswered}</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {isPassed
                    ? "Congratulations! You have successfully passed the aptitude test. Our team will contact you shortly with the next steps in the interview process."
                    : "Unfortunately, you did not meet the passing criteria for this test. We encourage you to review the topics and try again in the future."}
                </div>
              </div>
            </div>

            <Link href="/">
              <Button className="w-full flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
