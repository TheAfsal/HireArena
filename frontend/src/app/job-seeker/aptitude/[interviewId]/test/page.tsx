"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, AlertCircle, ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchAptitudeQuestions, submitAptitude } from "@/app/api/interview";

export interface AptitudeQuestion {
  q_id: string;
  question: string;
  options: Array<string>;
}

export default function TestPage() {
  const router = useRouter();
  const { interviewId } = useParams<{ interviewId: string }>();

  const {
    data: questions,
    isLoading,
    error,
  } = useQuery<AptitudeQuestion[]>({
    queryKey: ["aptitude_test_questions"],
    queryFn: () => fetchAptitudeQuestions(interviewId),
  });

  console.log('====================================');
  console.log(questions);
  console.log('====================================');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    questions ? Array(questions.length).fill(null) : Array(25).fill(null)
  );
  const [markedForReview, setMarkedForReview] = useState<boolean[]>(
    questions ? Array(questions.length).fill(false) : Array(25).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);

  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimeUpDialog(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!questions) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div>Unexpected Error</div>
      </div>
    );
  }

  const answeredCount = answers.filter((answer) => answer !== null).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = Number.parseInt(value);
    setAnswers(newAnswers);
  };

  const toggleMarkForReview = () => {
    const newMarkedForReview = [...markedForReview];
    newMarkedForReview[currentQuestion] = !newMarkedForReview[currentQuestion];
    setMarkedForReview(newMarkedForReview);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions!.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const submitTest = async () => {
    console.log(answers);
    try {
      let response = await submitAptitude(
        interviewId,
        answers.map((answer, i) => ({
          questionId: questions[i].q_id,
          selectedAnswer: answer === null ? null : answer.toString(),
        }))
      );
      console.log(response);

      router.push(`/job-seeker/aptitude/${interviewId}/results`);
    } catch (error) {}
  };

  const getQuestionStatusClass = (index: number) => {
    if (markedForReview[index]) {
      return "bg-yellow-100 border-yellow-500";
    }
    if (answers[index] !== null) {
      return "bg-green-100 border-green-500";
    }
    return "bg-gray-100 border-gray-300";
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-red-500">{"Job not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with timer and progress */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-red-500" />
          <div className="text-xl font-semibold">
            Time Remaining:{" "}
            <span className={timeLeft < 300 ? "text-red-500" : ""}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-1/2 gap-2">
          <div className="flex justify-between text-sm">
            <span>
              Progress: {answeredCount}/{questions.length} questions
            </span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question panel */}
        <div className="order-2 lg:order-1 lg:col-span-1">
          <div className="sticky top-6 rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`h-10 w-10 flex items-center justify-center rounded border-2 ${
                    currentQuestion === index ? "ring-2 ring-primary" : ""
                  } ${getQuestionStatusClass(index)}`}
                >
                  {index + 1}
                  {markedForReview[index] && (
                    <Flag className="absolute top-0 right-0 h-3 w-3 text-yellow-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-green-100 border border-green-500"></div>
                <span>Answered: {answeredCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-100 border border-gray-300"></div>
                <span>Not answered: {questions.length - answeredCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-yellow-100 border border-yellow-500"></div>
                <span>
                  Marked for review: {markedForReview.filter(Boolean).length}
                </span>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={() => setShowSubmitDialog(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>

        {/* Question content */}
        <div className="order-1 lg:order-2 lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-base px-3 py-1">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <Button
                  variant={
                    markedForReview[currentQuestion] ? "default" : "outline"
                  }
                  size="sm"
                  onClick={toggleMarkForReview}
                  className="flex items-center gap-1"
                >
                  <Flag className="h-4 w-4" />
                  {markedForReview[currentQuestion]
                    ? "Marked"
                    : "Mark for Review"}
                </Button>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  {questions[currentQuestion].question}
                </h2>
                <RadioGroup
                  value={answers[currentQuestion]?.toString() || ""}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleAnswerSelect(index.toString())}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-grow cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPrevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={goToNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center gap-1"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {questions.length}{" "}
              questions.
              {answeredCount < questions.length && (
                <div className="mt-2 flex items-center text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  You still have {questions.length - answeredCount} unanswered
                  questions.
                </div>
              )}
              Are you sure you want to submit your test?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={submitTest}>
              Submit Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time up dialog */}
      <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time's Up!</AlertDialogTitle>
            <AlertDialogDescription>
              Your test time has expired. Your answers will be automatically
              submitted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={submitTest}>
              View Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
