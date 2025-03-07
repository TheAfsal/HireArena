import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Code, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Machine Task Evaluation</h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Welcome to our machine task evaluation platform. Complete the assigned task and submit your GitHub repository
          for assessment.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 w-full max-w-4xl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Available Tasks</CardTitle>
              <Code className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Tasks to choose from</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Time Limit</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4 hrs</div>
              <p className="text-sm text-muted-foreground">Per task submission</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">68%</div>
              <p className="text-sm text-muted-foreground">Average pass rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">Available Tasks</h2>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Frontend React Dashboard</CardTitle>
                  <Badge>Frontend</Badge>
                </div>
                <CardDescription>Build a responsive admin dashboard with React and data visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a responsive admin dashboard with React that includes data visualization components, user
                  authentication, and responsive design.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>4 hour time limit</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/job-seeker/machine-task/task/frontend-dashboard" className="w-full">
                  <Button className="w-full">View Task Details</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Backend API Development</CardTitle>
                  <Badge>Backend</Badge>
                </div>
                <CardDescription>Create a RESTful API with Node.js and Express</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Develop a RESTful API using Node.js and Express that includes user authentication, data validation,
                  and proper error handling.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>4 hour time limit</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/job-seeker/machine-task/task/task/backend-api" className="w-full">
                  <Button className="w-full">View Task Details</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Full-Stack Web Application</CardTitle>
                  <Badge>Full-Stack</Badge>
                </div>
                <CardDescription>Build a complete web application with Next.js</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a full-stack web application using Next.js that includes user authentication, data fetching
                  from an API, and responsive design.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>4 hour time limit</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/job-seeker/machine-task/task/fullstack-app" className="w-full">
                  <Button className="w-full">View Task Details</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

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
  )
}

