import { DataTable } from "../components/data-table"

const companies = [
  { name: "TechCorp", location: "San Francisco", industry: "Technology", status: "Active", dateAdded: "2 days ago" },
  { name: "MarketPros", location: "Remote", industry: "Marketing", status: "Draft", dateAdded: "3 days ago" },
  { name: "BuildSoft", location: "New York", industry: "Construction", status: "Active", dateAdded: "5 days ago" },
  { name: "SalesHub", location: "Chicago", industry: "Sales", status: "Draft", dateAdded: "1 week ago" },
  { name: "AdVision", location: "Los Angeles", industry: "Advertising", status: "Active", dateAdded: "2 weeks ago" },
  { name: "ClientFirst", location: "Austin", industry: "Customer Service", status: "Active", dateAdded: "1 month ago" },
  { name: "DataWorks", location: "Boston", industry: "Analytics", status: "Draft", dateAdded: "2 months ago" },
  { name: "OpEx", location: "Denver", industry: "Operations", status: "Active", dateAdded: "3 months ago" },
  { name: "UXFocus", location: "Seattle", industry: "Research", status: "Draft", dateAdded: "4 months ago" },
  {
    name: "BizDevCo",
    location: "Houston",
    industry: "Business Development",
    status: "Active",
    dateAdded: "5 months ago",
  },
]

const columns = [
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "industry", label: "Industry" },
  { key: "status", label: "Status" },
  { key: "dateAdded", label: "Date Added" },
  { key: "actions", label: "Actions" },
]

export default function CompaniesPage() {
  return <DataTable title="Companies" columns={columns} data={companies} searchPlaceholder="Search companies" />
}

