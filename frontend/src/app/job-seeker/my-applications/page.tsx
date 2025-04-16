"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyApplications } from "@/app/api/job";
import { useRouter } from "next/navigation";

enum RoundType {
  TechnicalInterview = "Technical Interview",
  BehavioralInterview = "Behavioral Interview",
  AptitudeTest = "Aptitude Test",
  CodingChallenge = "Coding Challenge",
  MachineTask = "Machine Task",
}

enum RoundStatus {
  Scheduled = "scheduled",
  Completed = "completed",
  Failed = "failed",
  Pending = "pending",
}

interface IInterviewRound {
  roundType: RoundType;
  status: RoundStatus;
  videoCallLink?: string;
  scheduledInterviewId?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface IJobDetails {
  jobId: string;
  title: string;
  testOptions: string; // JSON string
  description: string;
}

interface IApplication {
  _id: string;
  jobId: string;
  candidateId: string;
  state: IInterviewRound[];
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  jobDetails: IJobDetails;
}

// const fetchCandidateApplications = async (): Promise<IApplication[]> => {
//   return [
//     {
//       _id: "67fdeb564a2de82587e8b43e",
//       jobId: "eabd9da8-0841-4cd5-a69f-6440145eaff4",
//       candidateId: "d536c55f-0426-4281-bc3c-45c35e8b72da",
//       state: [
//         {
//           roundType: RoundType.TechnicalInterview,
//           status: RoundStatus.Scheduled,
//           videoCallLink: "https://zoom.us/j/scheduledInterviewId",
//           scheduledInterviewId: "67fe0bdb5ce93cd11a411a65",
//           scheduledAt: "2025-04-18T07:30:00.000Z",
//           createdAt: "2025-04-15T07:33:47.261Z",
//           updatedAt: "2025-04-15T07:33:47.261Z",
//         },
//       ],
//       scheduledAt: "2025-04-15T05:15:02.100Z",
//       createdAt: "2025-04-15T05:15:02.100Z",
//       updatedAt: "2025-04-15T07:33:47.261Z",
//       __v: 0,
//       jobDetails: {
//         jobId: "eabd9da8-0841-4cd5-a69f-6440145eaff4",
//         title: "Jr. Designer",
//         testOptions:
//           '{"Machine Task":false,"Aptitude Test":false,"Coding Challenge":false,"Technical Interview":true,"Behavioral Interview":false}',
//         description: "fasdfasd fasdfasd",
//       },
//     },
//   ];
// };

const ApplicationList: React.FC<{
  applications: IApplication[];
  onViewDetails: (application: IApplication) => void;
}> = ({ applications, onViewDetails }) => {

  const router = useRouter();

  const getCurrentStatus = (state: IInterviewRound[]) =>
    state[state.length - 1]?.status || "Pending";

  const getNextStep = (state: IInterviewRound[], testOptions: string) => {
    const tests = JSON.parse(testOptions) as Record<string, boolean>;
    const completedRounds = state.map((r) => r.roundType);
    const nextTest = Object.keys(tests).find(
      (test) => tests[test] && !completedRounds.includes(test as RoundType)
    );
    return nextTest || "Completed";
  };

  console.log("@@", applications);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-blue-600">
        <h2 className="text-2xl font-bold text-white">My Applications</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Company/Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Current Step
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Next Step
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {app.jobDetails.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getCurrentStatus(app.state) === RoundStatus.Completed
                        ? "bg-green-100 text-green-800"
                        : getCurrentStatus(app.state) === RoundStatus.Failed
                        ? "bg-red-100 text-red-800"
                        : getCurrentStatus(app.state) === RoundStatus.Scheduled
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getCurrentStatus(app.state)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {app.state[app.state.length - 1].roundType}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getNextStep(app.state, app.jobDetails.testOptions)}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(app)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    View Details
                  </button>
                  {app.state[app.state.length - 1].roundType ===
                    "Machine Task" && (
                    <button
                      onClick={() => router.push(`/job-seeker/machine-task/${app.jobId}`)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;View Machine Task Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {applications.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No applications found.
        </div>
      )}
    </div>
  );
};

const ApplicationDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  application: IApplication | null;
}> = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  const tests = JSON.parse(application.jobDetails.testOptions) as Record<
    string,
    boolean
  >;
  const allRounds = Object.keys(tests).filter(
    (test) => tests[test]
  ) as RoundType[];
  const completedRounds = application.state.map((r) => r.roundType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {application.jobDetails.title} - Application Details
        </h3>
        <div className="space-y-4">
          {/* Tree Structure */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            {allRounds.map((round, idx) => {
              const roundData = application.state.find(
                (r) => r.roundType === round
              );
              const isCompleted = completedRounds.includes(round);
              const isCurrent = roundData && !completedRounds[idx + 1];

              return (
                <div key={round} className="relative flex items-start mb-6">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isCompleted
                          ? roundData?.status === RoundStatus.Completed
                            ? "bg-green-500"
                            : "bg-red-500"
                          : isCurrent
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-800">{round}</p>
                    {roundData ? (
                      <div className="text-sm text-gray-600">
                        <p>Status: {roundData.status}</p>
                        {roundData.scheduledAt && (
                          <p>
                            Scheduled:{" "}
                            {new Date(roundData.scheduledAt).toLocaleString()}
                          </p>
                        )}
                        {roundData.videoCallLink && (
                          <p>
                            <a
                              href={roundData.videoCallLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Video Call Link
                            </a>
                          </p>
                        )}
                        <p>
                          Created:{" "}
                          {new Date(roundData.createdAt).toLocaleString()}
                        </p>
                        <p>
                          Updated:{" "}
                          {new Date(roundData.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Pending</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const CandidateApplicationsPage: React.FC = () => {
  const {
    data: applications,
    isLoading,
    error,
  } = useQuery<IApplication[]>({
    queryKey: ["candidate_applications"],
    queryFn: () => fetchMyApplications(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<IApplication | null>(null);

  const handleViewDetails = (application: IApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Job Applications
        </h1>

        {isLoading && (
          <div className="text-center text-gray-600 py-10">
            Loading applications...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-10">
            Failed to load applications: {(error as Error).message}
          </div>
        )}
        {!isLoading && !error && applications && (
          <ApplicationList
            applications={applications}
            onViewDetails={handleViewDetails}
          />
        )}

        <ApplicationDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          application={selectedApplication}
        />
      </div>
    </div>
  );
};

export default CandidateApplicationsPage;

// original
// import React from "react";
// import { Separator } from "@/components/ui/separator";
// import JobList from "./components/JobList";

// const page = () => {
//   return (
//     <div className="p-10">
//       <div>
//         <h2 className="text-3xl font-bold">Find Jobs</h2>
//       </div>
//       <Separator className="my-5" />
//       <div className="py-8 flex gap-8">
//         <JobList />
//       </div>
//     </div>
//   );
// };

// export default page;
