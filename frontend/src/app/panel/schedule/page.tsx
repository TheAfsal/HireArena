"use client";
import React, { useState, useMemo, useEffect } from "react";
import { IInterview, RoundStatus, RoundType } from "@/Types/application.types";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchAllApplications, scheduleInterview } from "@/app/api/interview";
import { useQuery } from "@tanstack/react-query";

// Interface for scheduling
export interface ScheduleForm {
  interviewId: string;
  scheduledAt: Date | null;
}

// ApplicantsTable Component
const ApplicantsTable: React.FC<{
  interviews: IInterview[];
  onViewDetails: (interviewId: string) => void;
  onSchedule: (interviewId: string, roundType: RoundType) => void;
  userRole: string | null;
}> = ({ interviews, onViewDetails, onSchedule, userRole }) => {
  const getLatestRoundStatus = (state: IInterview["state"]) => {
    return state[state.length - 1]?.status || RoundStatus.Pending;
  };

  const canSchedule = (roundType: RoundType, status: RoundStatus) => {
    console.log(userRole);

    if (!userRole || ![RoundStatus.Pending].includes(status)) return false;
    const roleMap: { [key: string]: RoundType[] } = {
      HR: [RoundType.HrInterview],
      INTERVIEWER: [RoundType.TechnicalInterview],
      MANAGER: [RoundType.ManagerInterview],
    };
    return (
      roleMap[userRole]?.includes(roundType) &&
      ![
        RoundType.AptitudeTest,
        RoundType.MachineTask,
        RoundType.CodingChallenge,
      ].includes(roundType)
    );
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600">
          <h2 className="text-2xl font-bold text-white">
            All Job Applications
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Candidate ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Current Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Last Round
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interviews.map((interview) => {
                const latestRound = interview.state[interview.state.length - 1];
                return (
                  <tr
                    key={interview._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.candidateId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.jobId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getLatestRoundStatus(interview.state) ===
                          RoundStatus.Completed
                            ? "bg-green-100 text-green-800"
                            : getLatestRoundStatus(interview.state) ===
                              RoundStatus.Failed
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {getLatestRoundStatus(interview.state)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {latestRound?.roundType || "Not Started"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {interview.scheduledAt
                        ? new Date(interview.scheduledAt).toLocaleString()
                        : "Not Scheduled"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => onViewDetails(interview._id)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                      >
                        View Details
                      </button>
                      {canSchedule(
                        latestRound?.roundType,
                        latestRound?.status
                      ) && (
                        <button
                          onClick={() =>
                            onSchedule(interview._id, latestRound?.roundType)
                          }
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Schedule
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {interviews.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No applicants found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: ScheduleForm) => void;
  interviewId: string;
}> = ({ isOpen, onClose, onSubmit, interviewId }) => {
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (!scheduledAt) {
      alert("Please select a date and time.");
      return;
    }

    console.log("@@ scheduledAt ", interviewId, scheduledAt);

    onSubmit({ interviewId, scheduledAt });
    setScheduledAt(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Schedule Interview #{interviewId}
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date and Time
          </label>
          <DatePicker
            selected={scheduledAt}
            //@ts-ignore
            onChange={(date: Date) => setScheduledAt(date)}
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            minDate={new Date()}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const Page: React.FC = () => {
  const [interviews, setInterviews] = useState<IInterview[]>([]);
  const [filter, setFilter] = useState<RoundType | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<ScheduleForm | null>(null);

  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchInterviews = async () => {
      const applications = await fetchAllApplications();
      setInterviews(applications);
    };

    fetchInterviews();
  }, []);

  const {
    data: upcomingInterviews,
    isLoading: isUpcomingLoading,
    error: upcomingError,
  } = useQuery<UpcomingInterview>({
    queryKey: ["upcoming_interviews"],
    queryFn: () => fetchUpcomingInterviews(),
  });

  console.log("@@ upcomingInterviews", upcomingInterviews);

  const filteredInterviews = useMemo(() => {
    if (filter === "all") return interviews;
    return interviews.filter((interview) => {
      const latestRound = interview.state[interview.state.length - 1];
      return latestRound?.roundType === filter;
    });
  }, [interviews, filter]);

  const handleViewDetails = (interviewId: string) => {
    console.log("View details for interview:", interviewId);
  };

  const handleSchedule = (interviewId: string, roundType: RoundType) => {
    setSelectedInterview({ interviewId, scheduledAt: null });
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = async (form: ScheduleForm) => {
    await scheduleInterview(form);
    setInterviews((prev: any) =>
      prev.map((interview: any) =>
        interview._id === form.interviewId
          ? {
              ...interview,
              scheduledAt: form.scheduledAt,
              state: interview.state.map((round: any, idx: number) =>
                idx === interview.state.length - 1
                  ? {
                      ...round,
                      scheduledAt: form.scheduledAt,
                      status: RoundStatus.Scheduled,
                    }
                  : round
              ),
            }
          : interview
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Upcoming Interviews Section */}
        {isUpcomingLoading && (
          <div className="text-center text-gray-600 py-4">
            Loading upcoming interviews...
          </div>
        )}
        {upcomingError && (
          <div className="text-center text-red-500 py-4">
            Failed to load upcoming interviews:{" "}
            {(upcomingError as Error).message}
          </div>
        )}
        {!isUpcomingLoading && !upcomingError && upcomingInterviews && (
          <UpcomingInterviews
            upcomingData={upcomingInterviews}
            employeeId={auth.user?._id || ""}
          />
        )}

        {/* Interview Dashboard Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Interview Dashboard
          </h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as RoundType | "all")}
            className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Rounds</option>
            <option value={RoundType.TechnicalInterview}>
              Technical Interview
            </option>
            <option value={RoundType.HrInterview}>HR Interview</option>
            <option value={RoundType.ManagerInterview}>
              Manager Interview
            </option>
            <option value={RoundType.AptitudeTest}>Aptitude Test</option>
            <option value={RoundType.CodingChallenge}>Coding Challenge</option>
            <option value={RoundType.MachineTask}>Machine Task</option>
          </select>
        </div>

        {/* {isLoading && (
          <div className="text-center text-gray-600 py-10">Loading interviews...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-10">
            Failed to load interviews: {(error as Error).message}
          </div>
        )} */}
        {interviews && (
          <ApplicantsTable
            interviews={filteredInterviews}
            onViewDetails={handleViewDetails}
            onSchedule={handleSchedule}
            userRole={auth.role}
          />
        )}

        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleScheduleSubmit}
          interviewId={selectedInterview?.interviewId || ""}
        />
      </div>
    </div>
  );
};

export default Page;

interface UpcomingInterview {
  _id: { $oid: string };
  employeeId: string;
  __v: number;
  interviews: {
    candidateId: string;
    time: { $date: string };
    link: string;
    _id: { $oid: string };
  }[];
  updatedAt: { $date: string };
}

// Dummy API function for upcoming interviews
const fetchUpcomingInterviews = async (): Promise<UpcomingInterview> => {
  return {
    _id: { $oid: "67fe0522bc38a2e198d2d22f" },
    employeeId: "294c1418-fb66-43a9-b457-b50032a8c76f",
    __v: 0,
    interviews: [
      {
        candidateId: "d536c55f-0426-4281-bc3c-45c35e8b72da",
        time: { $date: "2025-04-15T07:45:00.081Z" },
        link: "https://zoom.us/j/scheduledInterviewId1",
        _id: { $oid: "67fe05225ce93cd11a411a41" },
      },
      {
        candidateId: "d536c55f-0426-4281-bc3c-45c35e8b72da",
        time: { $date: "2025-04-15T07:45:00.641Z" },
        link: "https://zoom.us/j/scheduledInterviewId2",
        _id: { $oid: "67fe0a6f5ce93cd11a411a5b" },
      },
    ],
    updatedAt: { $date: "2025-04-15T07:27:43.512Z" },
  };
};

// Upcoming Interviews Component
const UpcomingInterviews: React.FC<{
  upcomingData: UpcomingInterview;
  employeeId: string;
}> = ({ upcomingData, employeeId }) => {
  const now = new Date();

  const canJoin = (interviewTime: string) => {
    const interviewDate = new Date(interviewTime);
    return now >= interviewDate;
  };

  return (
    <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Upcoming Interviews
      </h2>
      {upcomingData.interviews.length > 0 ? (
        <ul className="space-y-4">
          {upcomingData.interviews.map((interview) => (
            <li
              key={interview._id.$oid}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">Candidate ID:</span>{" "}
                  {interview.candidateId}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span>{" "}
                  {new Date(interview.time.$date).toLocaleString()}
                </p>
              </div>
              <a
                href={
                  canJoin(interview.time.$date) ? interview.link : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  canJoin(interview.time.$date)
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) =>
                  !canJoin(interview.time.$date) && e.preventDefault()
                }
              >
                {canJoin(interview.time.$date) ? "Join Now" : "Pending"}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No upcoming interviews scheduled.</p>
      )}
    </div>
  );
};
