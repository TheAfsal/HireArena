import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="py-8 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <h1 className="text-2xl font-semibold">Loading...</h1>
          <p className="text-gray-500">Please wait while we process your request.</p>
        </div>
      </Card>
    </div>
  )
}

