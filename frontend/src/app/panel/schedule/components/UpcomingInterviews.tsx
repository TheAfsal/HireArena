import { ResultForm, UpcomingInterview } from "@/Types/interview.types";
import ResultModal from "./ResultModal";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const submitInterviewResult = async (form: ResultForm): Promise<void> => {
  console.log("Submitting interview result:", form);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const UpcomingInterviews: React.FC<{
  upcomingData: UpcomingInterview[];
  employeeId: string;
}> = ({ upcomingData, employeeId }) => {
  const [now, setNow] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<{
    interviewId: string;
    candidateId: string;
  } | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const canJoin = (interviewTime: string) => {
    try {
      const interviewDate = new Date(interviewTime);
      if (isNaN(interviewDate.getTime())) {
        console.error(`Invalid date: ${interviewTime}`);
        return false;
      }
      return now >= interviewDate;
    } catch (error) {
      console.error(`Error parsing date: ${interviewTime}`, error);
      return false;
    }
  };

  const mutation = useMutation({
    mutationFn: submitInterviewResult,
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries(["upcoming_interviews"]);
      console.log("Result submitted successfully");
    },
    onError: (error) => {
      console.error("Failed to submit result:", error);
    },
  });

  const handleSubmitResult = (form: ResultForm) => {
    mutation.mutate(form);
  };

  const openResultModal = (interviewId: string, candidateId: string) => {
    setSelectedInterview({ interviewId, candidateId });
    setIsModalOpen(true);
  };

  return (
    <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Upcoming Interviews
      </h2>
      {upcomingData.length > 0 ? (
        <ul className="space-y-4">
          {upcomingData.map((interview) => {
            const timeString = interview.time;
            const isValidDate = !isNaN(new Date(timeString).getTime());

            return (
              <li
                key={interview._id}
                className="flex justify-between items-center"
              >
                <div className="flex justify-start items-center gap-5">
                  <div className="flex justify-left items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        //@ts-ignore
                        src={interview?.candidate?.image}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {
                          //@ts-ignore
                           interview?.candidate?.fullName[0]
                        }
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-gray-700">
                      <span className="font-medium">Candidate:</span>{" "}
                      {
                        //@ts-ignore
                        interview.candidate.fullName
                      }
                    </p>
                  </div>
                  |
                  <p className="text-gray-600">
                    <span className="font-medium">Time to join:</span>{" "}
                    {isValidDate
                      ? new Date(timeString).toLocaleString()
                      : "Invalid Date"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={canJoin(timeString) ? interview.link : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                      canJoin(timeString)
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={(e) => !canJoin(timeString) && e.preventDefault()}
                  >
                    {canJoin(timeString) ? "Join Now" : "Pending"}
                  </a>
                  {canJoin(timeString) && (
                    <button
                      onClick={() =>
                        openResultModal(
                          interview.scheduledInterviewId,
                          interview.candidateId
                        )
                      }
                      className="px-4 py-2 rounded-md bg-amber-400 text-white font-medium hover:bg-amber-500 transition-colors"
                    >
                      Submit Result
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No upcoming interviews scheduled.</p>
      )}
      <ResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitResult}
        interviewId={selectedInterview?.interviewId || ""}
        candidateId={selectedInterview?.candidateId || ""}
      />
    </div>
  );
};

export default UpcomingInterviews;
