import Image from "next/image"

interface Company {
  id: number
  name: string
  logo: string
  description: string
  tags: string[]
  jobCount: number
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-start gap-4">
        <Image
          src={company.logo || "/placeholder.svg"}
          alt={`${company.name} logo`}
          width={48}
          height={48}
          className="rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{company.name}</h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{company.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              {company.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-sm text-indigo-600">{company.jobCount} Jobs</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyCard;

