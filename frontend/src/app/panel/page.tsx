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
  // Add other job fields as needed
}

interface Application {
  _id: string;
  candidateId: string; // Will map to candidateName via API
  jobId: string; // Will map to jobTitle via API
  state: { status: string; updatedAt: string }[];
  candidateName?: string; // Added after API mapping
  jobTitle?: string; // Added after API mapping
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
          applications: response[1].map((app: Application) => ({
            ...app,
            candidateName: app.candidateId, 
            jobTitle: app.jobId, 
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

// "use client";

// import Header from "./components/Headers";
// import { JobUpdates } from "./components/JobUpdates";
// import { MetricCard } from "./components/MetricCards";
// import { Sidebar } from "./components/SideBar";
// import type { RootState } from "@/redux/store";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function Dashboard() {
//   const [loading, setLoading] = useState(true);

//   const auth = useSelector((state: RootState) => state.auth);
//   const router = useRouter();
//   useEffect(() => {
//     console.log("Company Home Page");
//     console.log(auth.role);
//     console.log(auth.token);

//     if (!auth.token || auth.role !== "company") {
//       router.push("/login");
//     } else {
//       setLoading(false);
//     }
//   }, [auth]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="w-16 h-16 text-gray-500 font-bold">loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen ">
//       {/* <Sidebar />
//       <div className="flex-1">
//         <Header />
//         <main className="p-6">
//           <div className="mb-6">
//             <h1 className="text-2xl font-semibold mb-1">Good morning, Maria</h1>
//             <p className="text-gray-500">
//               Here is your job listings statistic report from July 19 - July 25.
//             </p>
//           </div>

//           <div className="grid grid-cols-3 gap-6 mb-6">
//             <MetricCard
//               number={76}
//               label="New candidates to review"
//               color="indigo"
//             />
//             <MetricCard number={3} label="Schedule for today" color="emerald" />
//             <MetricCard number={24} label="Messages received" color="blue" />
//           </div>

//           <div className="grid grid-cols-3 gap-6">
//             <div className="col-span-2 space-y-6">
//               <JobUpdates />
//             </div>
//             <div className="space-y-6">
//               <div className="bg-white rounded-xl p-6">
//                 <h2 className="text-xl font-semibold mb-4">Job Open</h2>
//                 <div className="text-4xl font-bold mb-1">12</div>
//                 <div className="text-gray-500">Jobs Opened</div>
//               </div>

//               <div className="bg-white rounded-xl p-6">
//                 <h2 className="text-xl font-semibold mb-4">
//                   Applicants Summary
//                 </h2>
//                 <div className="text-4xl font-bold mb-4">67</div>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span>Full Time</span>
//                     <span className="font-medium">45</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span>Internship</span>
//                     <span className="font-medium">32</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span>Part Time</span>
//                     <span className="font-medium">24</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span>Contract</span>
//                     <span className="font-medium">30</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span>Remote</span>
//                     <span className="font-medium">22</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div> */}
//     </div>
//   );
// }
