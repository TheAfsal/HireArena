"use client";

import React, { useState } from "react";
import Link from "next/link";

// Mock data (replace with API calls)
const mockData = {
  companyName: "TechCorp",
  stats: {
    activeJobs: 5,
    applications: 42,
    interviews: 3,
  },
  applications: [
    {
      id: "app1",
      candidateName: "John Doe",
      jobTitle: "Frontend Developer",
      appliedAt: "2025-04-10",
      conversationId: "conv1",
    },
    {
      id: "app2",
      candidateName: "Jane Smith",
      jobTitle: "Backend Engineer",
      appliedAt: "2025-04-12",
      conversationId: "conv2",
    },
  ],
  interviews: [
    {
      id: "int1",
      candidateName: "John Doe",
      time: "2025-04-16 10:00 AM",
      conversationId: "conv1",
    },
    {
      id: "int2",
      candidateName: "Jane Smith",
      time: "2025-04-17 2:00 PM",
      conversationId: "conv2",
    },
  ],
};

const CompanyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userId = "company-123";

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="p-6 flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Active Jobs</h3>
            <p className="text-3xl font-bold text-green-600">
              {mockData.stats.activeJobs}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Applications</h3>
            <p className="text-3xl font-bold text-green-600">
              {mockData.stats.applications}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
            <p className="text-3xl font-bold text-green-600">
              {mockData.stats.interviews}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Create Job Post
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Schedule Interview
            </button>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.candidateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.appliedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/chat?conversationId=${app.conversationId}`}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Chat
                      </Link>
                      <Link
                        href={`/video-call?conversationId=${app.conversationId}`}
                        className="text-green-600 hover:underline"
                      >
                        Start Video Call
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {interview.candidateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {interview.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/video-call?conversationId=${interview.conversationId}`}
                        className="text-green-600 hover:underline"
                      >
                        Join Video Call
                      </Link>
                    </td>
                  </tr>
                ))}
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
