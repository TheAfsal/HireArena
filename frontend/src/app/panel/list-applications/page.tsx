"use client";
import React, { useState } from "react";
import { IInterview, RoundStatus, RoundType } from "@/Types/application.types";
import { fetchAllApplications } from "@/app/api/interview";
import { useQuery } from "@tanstack/react-query";

interface ApplicantsTableProps {
  interviews: IInterview[];
  onViewDetails: (interviewId: string) => void;
}

const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  interviews,
  onViewDetails,
}) => {
  const getLatestRoundStatus = (state: IInterview["state"]) => {
    return state[state.length - 1]?.status || "Pending";
  };

  return (
    <div className=" mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            All Job Applicantions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Round
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interviews.map((interview) => (
                <tr key={interview._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {interview.candidateId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {interview.jobId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          getLatestRoundStatus(interview.state) ===
                          RoundStatus.Completed
                            ? "bg-green-100 text-green-800"
                            : getLatestRoundStatus(interview.state) ===
                              RoundStatus.Failed
                            ? "bg-red-100 text-red-800"
                            : getLatestRoundStatus(interview.state) ===
                              RoundStatus.Pending
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {getLatestRoundStatus(interview.state)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {interview.state[interview.state.length - 1]?.roundType ||
                      "Not Started"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {interview.scheduledAt
                      ? new Date(interview.scheduledAt).toLocaleDateString()
                      : "Not Scheduled"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(interview._id)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {interviews.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No applicants found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const dummyInterviews: IInterview[] = [
  {
    _id: "1",
    jobId: "JOB001",
    candidateId: "CAND001",
    state: [
      {
        roundType: RoundType.AptitudeTest,
        status: RoundStatus.Completed,
        scheduledAt: new Date("2025-04-10T10:00:00Z"),
        completedAt: new Date("2025-04-10T11:00:00Z"),
        remarks: "Scored 85%",
        createdAt: new Date("2025-04-09T08:00:00Z"),
        updatedAt: new Date("2025-04-10T11:00:00Z"),
      },
      {
        roundType: RoundType.TechnicalInterview,
        status: RoundStatus.Scheduled,
        scheduledAt: new Date("2025-04-15T14:00:00Z"),
        createdAt: new Date("2025-04-11T09:00:00Z"),
        updatedAt: new Date("2025-04-11T09:00:00Z"),
      },
    ],
    scheduledAt: new Date("2025-04-10T10:00:00Z"),
    createdAt: new Date("2025-04-09T08:00:00Z"),
    updatedAt: new Date("2025-04-11T09:00:00Z"),
  },
  {
    _id: "2",
    jobId: "JOB002",
    candidateId: "CAND002",
    state: [
      {
        roundType: RoundType.CodingChallenge,
        status: RoundStatus.Failed,
        scheduledAt: new Date("2025-04-08T13:00:00Z"),
        completedAt: new Date("2025-04-08T15:00:00Z"),
        remarks: "Did not meet minimum requirements",
        createdAt: new Date("2025-04-07T10:00:00Z"),
        updatedAt: new Date("2025-04-08T15:00:00Z"),
      },
    ],
    scheduledAt: new Date("2025-04-08T13:00:00Z"),
    completedAt: new Date("2025-04-08T15:00:00Z"),
    createdAt: new Date("2025-04-07T10:00:00Z"),
    updatedAt: new Date("2025-04-08T15:00:00Z"),
  },
  {
    _id: "3",
    jobId: "JOB001",
    candidateId: "CAND003",
    state: [
      {
        roundType: RoundType.AptitudeTest,
        status: RoundStatus.Completed,
        scheduledAt: new Date("2025-04-14T09:00:00Z"),
        createdAt: new Date("2025-04-11T12:00:00Z"),
        updatedAt: new Date("2025-04-11T12:00:00Z"),
      },
    ],
    scheduledAt: new Date("2025-04-14T09:00:00Z"),
    createdAt: new Date("2025-04-11T12:00:00Z"),
    updatedAt: new Date("2025-04-11T12:00:00Z"),
  },
];

const Page: React.FC = () => {
  const [interviews] = useState<IInterview[]>([]);

  const handleViewDetails = (interviewId: string) => {
    console.log("View details for interview:", interviewId);
  };

  const {
    data: applications,
    isLoading,
    error,
  } = useQuery<IInterview[]>({
    queryKey: ["all_application_company"],
    queryFn: () => fetchAllApplications(),
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {isLoading && (
        <div className="text-center text-gray-600">Loading interviews...</div>
      )}

      {error && (
        <div className="text-center text-red-500">
          Failed to load interviews. Please try again later.
        </div>
      )}

      {!isLoading && !error && (
        <ApplicantsTable
          interviews={applications ?? []}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default Page;
