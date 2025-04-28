import { submitVideoInterview } from "@/app/api/interview";
import { ResultForm } from "@/Types/interview.types";
import { useState } from "react";

const ResultModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: ResultForm) => void;
    interviewId: string;
    candidateId: string;
  }> = ({ isOpen, onClose, onSubmit, interviewId, candidateId }) => {
    const [remarks, setRemarks] = useState("");
    const [status, setStatus] = useState<"passed" | "failed" | "">("");
  
    const handleSubmit = async () => {
      if (!status) {
        alert("Please select a status.");
        return;
      }
      onSubmit({ interviewId, candidateId, remarks, status });
      await submitVideoInterview( interviewId, candidateId, remarks, status )
      setRemarks("");
      setStatus("");
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Submit Interview Result
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "passed" | "failed")}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="completed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="Enter your remarks here..."
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
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
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };


  export default ResultModal;