"use client";

import { useState, useMemo, useEffect } from "react";
import { IInterview, RoundStatus, RoundType } from "@/Types/application.types";
import { useSelector } from "react-redux";
import { fetchAllApplications, fetchMySchedule, scheduleInterview } from "@/app/api/interview";
import { useQuery } from "@tanstack/react-query";
import ApplicantsTable from "./components/ApplicantsTable";
import ScheduleModal from "./components/ScheduleModal";
import { ScheduleForm, UpcomingInterview } from "@/Types/interview.types";
import UpcomingInterviews from "./components/UpcomingInterviews";

export interface IEnrichedInterview extends IInterview {
  jobTitle: string | null;
  candidate: {
    id: string;
    fullName: string;
    email: string;
    image: string;
  } | null;
}

const Page: React.FC = () => {
  const [filter, setFilter] = useState<RoundType | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<ScheduleForm | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const auth = useSelector((state: any) => state.auth);

  const {
    data: applicationsData,
    isLoading: isApplicationsLoading,
    error: applicationsError,
  } = useQuery<{
    data: IEnrichedInterview[];
    pagination: { total: number; page: number; pageSize: number; totalPages: number };
  }>({
    queryKey: ["applications", page, filter],
    queryFn: () => fetchAllApplications({ page, pageSize, roundType: filter !== "all" ? filter : undefined }),
  });

  const {
    data: upcomingInterviews,
    isLoading: isUpcomingLoading,
    error: upcomingError,
  } = useQuery<UpcomingInterview[]>({
    queryKey: ["upcoming_interviews"],
    queryFn: () => fetchMySchedule(),
  });

  useEffect(() => {
    if (applicationsData) {
      setTotal(applicationsData.pagination.total);
    }
  }, [applicationsData]);

  const filteredInterviews = useMemo(() => {
    if (!applicationsData?.data) return [];
    return applicationsData.data;
  }, [applicationsData]);

  const handleViewDetails = (interviewId: string) => {
    console.log("View details for interview:", interviewId);
  };

  const handleSchedule = (interviewId: string, roundType: RoundType) => {
    setSelectedInterview({ interviewId, scheduledAt: null });
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = async (form: ScheduleForm) => {
    await scheduleInterview(form);
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / pageSize)) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        {isUpcomingLoading && (
          <div className="text-center text-gray-600 py-4">
            Loading upcoming interviews...
          </div>
        )}
        {upcomingError && (
          <div className="text-center text-red-500 py-4">
            Failed to load upcoming interviews: {(upcomingError as Error).message}
          </div>
        )}
        {!isUpcomingLoading && !upcomingError && upcomingInterviews && (
          <UpcomingInterviews
            upcomingData={upcomingInterviews}
            employeeId={auth.user?._id || ""}
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Interview Dashboard</h1>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as RoundType | "all");
              setPage(1); // Reset to page 1 on filter change
            }}
            className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Rounds</option>
            <option value={RoundType.TechnicalInterview}>Technical Interview</option>
            <option value={RoundType.HrInterview}>HR Interview</option>
            <option value={RoundType.ManagerInterview}>Manager Interview</option>
            <option value={RoundType.AptitudeTest}>Aptitude Test</option>
            <option value={RoundType.CodingChallenge}>Coding Challenge</option>
            <option value={RoundType.MachineTask}>Machine Task</option>
          </select>
        </div>

        {isApplicationsLoading && (
          <div className="text-center text-gray-600 py-4">
            Loading applications...
          </div>
        )}
        {applicationsError && (
          <div className="text-center text-red-500 py-4">
            Failed to load applications: {(applicationsError as Error).message}
          </div>
        )}
        {!isApplicationsLoading && !applicationsError && (
          <ApplicantsTable
            interviews={filteredInterviews}
            onViewDetails={handleViewDetails}
            onSchedule={handleSchedule}
            userRole={auth.role}
            pagination={{
              total,
              page,
              pageSize,
              totalPages: Math.ceil(total / pageSize),
              onPageChange: handlePageChange,
            }}
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