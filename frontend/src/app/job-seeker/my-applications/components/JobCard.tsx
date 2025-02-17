import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MyApplications } from "./JobList";

function JobCard({ job }: { job: MyApplications }) {
  return (
    <Link
      href={`/jobs/${job.jobId}`}
      className="flex items-center justify-between rounded-xl border bg-white p-6 hover:bg-slate-50 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={job.companyLogo} />
          <AvatarFallback>{job.companyName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{job.jobTitle}</h3>
          <p className="text-sm text-gray-500">
            {job.companyName}
          </p>
          
        </div>
      </div>
    </Link>
  );
}

export default JobCard;
