import mongoose, { Schema, Document } from "mongoose";

export interface IAptitudeQuestion {
  q_id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuestions extends Document {
  jobId: string;
  aptitudeQuestions: IAptitudeQuestion[];
}

const AptitudeQuestionSchema: Schema = new Schema(
  {
    q_id: { type: Number, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
  },
  { _id: false }
);

const QuestionSchema: Schema = new Schema({
  jobId: { type: String, required: true },
  aptitudeQuestions: { type: [AptitudeQuestionSchema] },
});

export default mongoose.model<IQuestions>(
  "Questions",
  QuestionSchema
);