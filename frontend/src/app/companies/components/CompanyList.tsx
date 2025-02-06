import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import CompanyCard  from "./CompanyCard"

const companies = [
  {
    id: 1,
    name: "Stripe",
    logo: "/placeholder.svg?height=64&width=64",
    description:
      "Stripe is a software platform for starting and running internet businesses. Millions of businesses rely on Stripe's software tools...",
    tags: ["Business", "Payment gateway"],
    jobCount: 7,
  },
  {
    id: 2,
    name: "Truebill",
    logo: "/placeholder.svg?height=64&width=64",
    description:
      "Take control of your money. Truebill develops a mobile app that helps consumers take control of their financial...",
    tags: ["Business", "Consumer"],
    jobCount: 7,
  },
  {
    id: 3,
    name: "Square",
    logo: "/placeholder.svg?height=64&width=64",
    description:
      "Square builds common business tools in unconventional ways so more people can start, run, and grow their businesses",
    tags: ["Business"],
    jobCount: 7,
  },
  {
    id: 4,
    name: "Coinbase",
    logo: "/placeholder.svg?height=64&width=64",
    description:
      "Coinbase is a digital currency wallet and platform where merchants and consumers can transact with new digital currencies",
    tags: ["Business", "Blockchain"],
    jobCount: 7,
  },
]

function CompanyList() {
  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">All Jobs</h2>
          <p className="text-sm text-gray-500">Showing 73 results</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="rounded-md border-gray-300 text-sm">
              <option>Most relevant</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>
          <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  )
}

export default CompanyList;

