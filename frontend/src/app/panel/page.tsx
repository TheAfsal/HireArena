"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDashboardData } from "@/app/api/company"; // Adjust path
import { toast } from "sonner";

interface Job {
  id: string;
  jobTitle: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  createdAt: string;
}

interface Application {
  _id: string;
  candidateId: string;
  jobId: string;
  state: { status: string; updatedAt: string }[];
  candidate: { id: string; fullName: string; email: string };
  candidateName: string;
  jobTitle?: string;
}

interface DashboardData {
  jobs: Job[];
  applications: Application[];
}

const CompanyDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    jobs: [],
    applications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchDashboardData();
        setData({
          //@ts-ignore
          jobs: response[0],
          //@ts-ignore
          applications: response[1].map((app: Application) => ({
            ...app,
            candidateName: app.candidate.fullName,
            jobTitle: app.jobTitle,
          })),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Company Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your jobs and applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Active Jobs</h3>
            <p className="mt-2 text-4xl font-bold text-indigo-600">
              {data.jobs.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Applications
            </h3>
            <p className="mt-2 text-4xl font-bold text-indigo-600">
              {data.applications.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Upcoming Interviews
            </h3>
            <p className="mt-2 text-4xl font-bold text-indigo-600">0</p>{" "}
            {/* Placeholder */}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Actions
          </h3>
          <div className="flex space-x-4">
            <Link
              href="/panel/post-job"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Job Post
            </Link>
            <Link
              href="/panel/jobs-list"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View All Jobs
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Applications
          </h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.applications.length > 0 ? (
                  data.applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.candidateName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.jobTitle || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          app.state[app.state.length - 1].updatedAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/panel/applications/${app._id}`}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
