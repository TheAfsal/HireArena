import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  tags: string[];
  applied: number;
  capacity: number;
  logo: string;
}

 function JobCard({ job }: { job: Job }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-[] p-6">
      <div className="flex items-start gap-4">
        <Image
          src={job.logo || "/placeholder.svg"}
          alt={`${job.company} logo`}
          width={48}
          height={48}
          className="rounded-lg"
        />
        <div>
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {job.company} • {job.location}
          </p>
          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
              {job.type}
            </span>
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button className="dark:bg-gray-700">Apply</Button>
        <p className="text-sm text-gray-500">
          {job.applied} applied of {job.capacity} capacity
        </p>
      </div>
    </div>
  );
}

export default JobCard;