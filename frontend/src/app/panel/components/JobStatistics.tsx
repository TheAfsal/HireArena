// "use client"

// import { useState } from "react"
// import { Bar } from "react-chartjs-2"
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// export function JobStatistics() {
//   const [activeTab, setActiveTab] = useState("overview")

//   const data = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Job View",
//         data: [65, 45, 65, 45, 65, 45, 45],
//         backgroundColor: "#F59E0B",
//       },
//       {
//         label: "Job Applied",
//         data: [45, 55, 35, 55, 35, 25, 35],
//         backgroundColor: "#6366F1",
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     scales: {
//       x: {
//         stacked: true,
//       },
//       y: {
//         stacked: true,
//       },
//     },
//   }

//   return (
//     <div className="bg-white rounded-xl p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-semibold mb-1">Job statistics</h2>
//           <div className="text-sm text-gray-500">Showing Job statistic Jul 19-25</div>
//         </div>
//         <div className="flex gap-2">
//           <button
//             className={`px-4 py-1 rounded-full text-sm ${activeTab === "overview" ? "bg-indigo-100 text-indigo-600" : "text-gray-500"}`}
//           >
//             Overview
//           </button>
//           <button
//             className={`px-4 py-1 rounded-full text-sm ${activeTab === "jobs-view" ? "bg-indigo-100 text-indigo-600" : "text-gray-500"}`}
//           >
//             Jobs View
//           </button>
//           <button
//             className={`px-4 py-1 rounded-full text-sm ${activeTab === "jobs-applied" ? "bg-indigo-100 text-indigo-600" : "text-gray-500"}`}
//           >
//             Jobs Applied
//           </button>
//         </div>
//       </div>
//       <Bar data={data} options={options} height={200} />
//     </div>
//   )
// }

