"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, GitBranch, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { tasks } from "../../../data/task"

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.taskId as string

  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submission, setSubmission] = useState<string | null>(null)
  const [submittedAt, setSubmittedAt] = useState<number | null>(null)
  const [evaluationStatus, setEvaluationStatus] = useState<"pending" | "evaluating" | "passed" | "failed">("pending")
  const [evaluationProgress, setEvaluationProgress] = useState(0)
  const [evaluationResults, setEvaluationResults] = useState<any>(null)

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId)
    if (foundTask) {
      setTask(foundTask)
    } else {
      router.push("/job-seeker")
      return
    }

    const storedSubmission = localStorage.getItem(`task_${taskId}_submission`)
    const storedSubmittedAt = localStorage.getItem(`task_${taskId}_submitted_at`)

    if (!storedSubmission || !storedSubmittedAt) {
      router.push(`/tasks/${taskId}`)
      return
    }

    setSubmission(storedSubmission)
    setSubmittedAt(Number.parseInt(storedSubmittedAt))
    setLoading(false)

    setEvaluationStatus("evaluating")

    const progressInterval = setInterval(() => {
      setEvaluationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    setTimeout(() => {
      clearInterval(progressInterval)
      setEvaluationProgress(100)

      const passed = Math.random() > 0.3 

      setEvaluationStatus(passed ? "passed" : "failed")
      setEvaluationResults({
        passed,
        score: passed ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 40, 
        feedback: passed
          ? "Your solution meets all the requirements and demonstrates good coding practices."
          : "Your solution does not meet all the requirements. Please review the feedback below.",
        criteriaResults: foundTask.evaluationCriteria.map((criteria: string) => ({
          criteria,
          passed: passed ? true : Math.random() > 0.4, 
          feedback: passed
            ? "Excellent implementation."
            : "Needs improvement. Consider refactoring this part of your solution.",
        })),
      })
    }, 5000)
  }, [taskId, router])

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading results...</div>
  }

  if (!task || !submission) {
    return <div className="container mx-auto px-4 py-12 text-center">No submission found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/tasks/${taskId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Task
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Submission Results</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge>{task.category}</Badge>
            <div className="text-sm text-muted-foreground">{submittedAt && new Date(submittedAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-muted-foreground" />
          <a href={submission} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            View GitHub Repository
          </a>
        </div>
      </div>

      {evaluationStatus === "evaluating" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Evaluating Your Submission</CardTitle>
            <CardDescription>Please wait while we analyze your code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Evaluation progress</span>
                <span>{evaluationProgress}%</span>
              </div>
              <Progress value={evaluationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {evaluationStatus === "passed" && evaluationResults && (
        <Card className="mb-6 border-green-500">
          <CardHeader className="bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <CardTitle>Congratulations! Your submission passed</CardTitle>
            </div>
            <CardDescription>
              Your solution meets our requirements and demonstrates good coding practices
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col items-center justify-center p-6 border rounded-lg">
                  <div className="text-5xl font-bold text-green-500">{evaluationResults.score}%</div>
                  <div className="text-sm text-muted-foreground mt-2">Overall Score</div>
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="font-semibold text-lg">Feedback</h3>
                  <p>{evaluationResults.feedback}</p>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span>Your solution has been accepted</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Evaluation Criteria</h3>
                <div className="space-y-3">
                  {evaluationResults.criteriaResults.map((result: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">{result.criteria}</div>
                        <div className="text-sm text-muted-foreground">{result.feedback}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="sm:flex-1">
              <Link href={`/tasks/${taskId}`}>View Task Details</Link>
            </Button>
            <Button asChild className="sm:flex-1">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {evaluationStatus === "failed" && evaluationResults && (
        <Card className="mb-6 border-red-500">
          <CardHeader className="bg-red-50 dark:bg-red-950/20">
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              <CardTitle>Your submission did not pass</CardTitle>
            </div>
            <CardDescription>Your solution does not meet all of our requirements</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col items-center justify-center p-6 border rounded-lg">
                  <div className="text-5xl font-bold text-red-500">{evaluationResults.score}%</div>
                  <div className="text-sm text-muted-foreground mt-2">Overall Score</div>
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="font-semibold text-lg">Feedback</h3>
                  <p>{evaluationResults.feedback}</p>
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Your solution has not been accepted</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Evaluation Criteria</h3>
                <div className="space-y-3">
                  {evaluationResults.criteriaResults.map((result: any, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      {result.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">{result.criteria}</div>
                        <div className="text-sm text-muted-foreground">{result.feedback}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Next Steps</h4>
                    <p className="text-sm">
                      We recommend reviewing the feedback above, making the necessary improvements to your code, and
                      submitting a new solution. You can resubmit your solution by returning to the task page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="sm:flex-1">
              <Link href={`/tasks/${taskId}`}>Try Again</Link>
            </Button>
            <Button asChild className="sm:flex-1">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

