import mongoose, { Schema, Document } from "mongoose";
import { RoundStatus } from "./Interview";

export interface IQuestionResult {
  questionId: string;
  isCorrect: boolean;
}

export interface IAptitudeTestResult extends Document {
  totalQuestions: number;
  attemptedCount: number;
  scorePercentage: number;
  status: RoundStatus;
  results: IQuestionResult[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionResultSchema: Schema = new Schema(
  {
    questionId: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const AptitudeTestResultSchema: Schema = new Schema(
  {
    totalQuestions: { type: Number, required: true },
    attemptedCount: { type: Number, required: true },
    scorePercentage: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(RoundStatus),
      required: true,
    },
    results: { type: [QuestionResultSchema], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IAptitudeTestResult>(
  "AptitudeTestResult",
  AptitudeTestResultSchema
);
