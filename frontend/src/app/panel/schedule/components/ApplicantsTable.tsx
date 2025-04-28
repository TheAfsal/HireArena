import { IInterview, RoundStatus, RoundType } from "@/Types/application.types";
import { Button } from "@/components/ui/button";
import { IEnrichedInterview } from "../page";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const ApplicantsTable: React.FC<{
  interviews: IEnrichedInterview[];
  onViewDetails: (interviewId: string) => void;
  onSchedule: (interviewId: string, roundType: RoundType) => void;
  userRole: string | null;
  pagination: PaginationProps;
}> = ({ interviews, onViewDetails, onSchedule, userRole, pagination }) => {
  const getLatestRoundStatus = (state: IInterview["state"]) => {
    return state[state.length - 1]?.status || RoundStatus.Pending;
  };

  const canSchedule = (roundType: RoundType, status: RoundStatus) => {
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
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Candidate Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Candidate Email
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
                      {interview.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.candidate?.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {interview.candidate?.email}
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
        {interviews.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4">
            <Button
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {pagination.page} of {pagination.totalPages} (Total:{" "}
              {pagination.total})
            </span>
            <Button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsTable;
