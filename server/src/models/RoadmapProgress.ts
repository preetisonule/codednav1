import mongoose, { Schema, Document } from "mongoose";

export interface IRoadmapProgress extends Document {
  analysisId: mongoose.Types.ObjectId;
  completedDays: number[];
  completedTasks: Map<string, number[]>;
  updatedAt: Date;
}

const roadmapProgressSchema =
  new Schema<IRoadmapProgress>(
    {
      analysisId: {
        type: Schema.Types.ObjectId,
        ref: "Analysis",
        required: true,
        unique: true,
      },

      completedDays: {
        type: [Number],
        default: [],
      },

      completedTasks: {
        type: Map,
        of: [Number],
        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<IRoadmapProgress>(
  "RoadmapProgress",
  roadmapProgressSchema
);