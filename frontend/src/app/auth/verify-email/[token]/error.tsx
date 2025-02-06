"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="py-8 space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-semibold text-red-500">Something went wrong!</h1>
          <p className="text-gray-500">We encountered an error while processing your request. Please try again.</p>
          <div className="pt-4 space-y-2">
            <Button onClick={reset} variant="outline" className="w-full">
              Try Again
            </Button>
            <Link href="/">
              <Button className="w-full">Return to Homepage</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

