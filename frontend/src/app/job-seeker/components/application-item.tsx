import { MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ApplicationItemProps {
  logo: string
  company: string
  title: string
  location: string
  type: string
  date: string
  status: "In Review" | "Shortlisted" | "Declined"
}

export default function ApplicationItem({ logo, company, title, location, type, date, status }: ApplicationItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Review":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "Shortlisted":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Declined":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={logo || "/placeholder.svg"} alt={company} className="w-10 h-10 rounded" />
        <div>
          <h4 className="font-semibold">{title}</h4>
          <div className="text-sm text-muted-foreground">
            {company} • {location} • {type}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">{date}</div>
        <Badge variant="secondary" className={getStatusColor(status)}>
          {status}
        </Badge>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

