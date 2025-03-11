import { Button } from "@/components/ui/button";
import obsList from "./JobList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

function JobCard({ job }: { job: any }) {
  console.log(job);
  
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex items-center justify-between rounded-xl border bg-white p-6 hover:bg-slate-50 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={job.companyLogo} />
          <AvatarFallback>{job.companyName}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{job.jobTitle}</h3>
          <p className="text-sm text-gray-500">
            {job.responsibilities} • {job.companyLocation}
          </p>
          <div className="mt-2 flex gap-2">
            <span className="rounded-full bg-green-100 px-2.5 py-2 text-sm font-medium text-green-800">
              {job.jobDescription}
            </span>
            {job.requiredSkills.map((tag:any) => (
              <span
                key={tag.id}
                className="rounded-full bg-blue-100 px-2.5 py-2 text-xs font-medium text-blue-800"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {job.isApplied ? (
          <Button disabled>Applied</Button>
        ) : (
          <Button>Apply</Button>
        )}
        <p className="text-sm text-gray-500">
          {job.applied} applied of {job.capacity} capacity
        </p>
      </div>
    </Link>
  );
}

export default JobCard;
