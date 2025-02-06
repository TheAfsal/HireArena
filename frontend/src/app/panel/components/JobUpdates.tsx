interface JobUpdate {
    company: string
    position: string
    location: string
    type: string
    tags: string[]
    applied: number
    capacity: number
  }
  
  export function JobUpdates() {
    const jobs: JobUpdate[] = [
      {
        company: "Nomad",
        position: "Social Media Assistant",
        location: "Paris, France",
        type: "Full Time",
        tags: ["Marketing", "Design"],
        applied: 5,
        capacity: 10,
      },
      {
        company: "Nomad",
        position: "Brand Designer",
        location: "Paris, France",
        type: "Full Time",
        tags: ["Business", "Design"],
        applied: 5,
        capacity: 10,
      },
      // Add more jobs as needed
    ]
  
    return (
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Job Updates</h2>
          <button className="text-indigo-600 text-sm font-medium">View All</button>
        </div>
        <div className="grid gap-4">
          {jobs.map((job, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg"></div>
                  <div>
                    <div className="font-medium">{job.position}</div>
                    <div className="text-sm text-gray-500">
                      {job.company} • {job.location}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-emerald-500 font-medium">{job.type}</div>
              </div>
              <div className="flex gap-2 mb-4">
                {job.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`px-3 py-1 rounded-full text-sm ${
                      tagIndex === 0 ? "bg-orange-100 text-orange-600" : "bg-indigo-100 text-indigo-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {job.applied} applied of {job.capacity} capacity
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  