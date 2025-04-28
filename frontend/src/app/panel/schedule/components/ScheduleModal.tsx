import { ScheduleForm } from "@/Types/interview.types";
import { useState } from "react";
import DatePicker from "react-datepicker";

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

  export default ScheduleModal