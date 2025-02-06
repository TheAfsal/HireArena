
export default function Page() {
  return (
    <></>
  )
}


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
