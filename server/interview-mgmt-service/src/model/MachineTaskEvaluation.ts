// import mongoose, { Schema, Document } from "mongoose";

// export interface IMachineTaskEvaluation extends Document {
//   id: string;
//   machineTaskId: string;
//   criteria: string;
// }

// const MachineTaskEvaluationSchema: Schema = new Schema({
//   _id: { type: Schema.Types.ObjectId, auto: true },
//   machineTaskId: { type: Schema.Types.ObjectId, ref: "MachineTask", required: true },
//   criteria: { type: String, required: true },
// });

// export default mongoose.model<IMachineTaskEvaluation>("MachineTaskEvaluation", MachineTaskEvaluationSchema);