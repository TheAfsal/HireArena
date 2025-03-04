import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MyApplications } from "./JobList";
import { Badge } from "@/components/ui/badge";
import { getBadgeClass } from "@/app/jobs/[jobId]/page";

function JobCard({ job }: { job: MyApplications }) {
  return (
    <Link
      href={`/jobs/${job.jobId}`}
      className="flex items-center justify-between rounded-xl border bg-white p-6 hover:bg-slate-50 cursor-pointer"
    >
      <div className="flex justify-between w-full items-start gap-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={job.companyLogo} />
            <AvatarFallback>{job.companyName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{job.jobTitle}</h3>
            <p className="text-sm text-gray-500">{job.companyName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button disabled>Applied</Button>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={getBadgeClass(job?.status)}>
              {job?.status}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default JobCard;
