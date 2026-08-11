import mongoose, { Schema, Document } from "mongoose";

export interface IRoadmapTask {
  title: string;
  description: string;
  estimatedHours: number;
  category: string;
  completed: boolean;
}

export interface IRoadmapDay {
  day: number;
  focus: string;
  tasks: IRoadmapTask[];
  completed: boolean;
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  analysisId: mongoose.Types.ObjectId;

  targetRole: string;
  totalDays: number;

  days: IRoadmapDay[];

  status: "active" | "completed";

  progress: number;

  createdAt: Date;
  updatedAt: Date;
}

const roadmapTaskSchema = new Schema<IRoadmapTask>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    estimatedHours: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const roadmapDaySchema = new Schema<IRoadmapDay>(
  {
    day: {
      type: Number,
      required: true,
    },

    focus: {
      type: String,
      required: true,
    },

    tasks: {
      type: [roadmapTaskSchema],
      default: [],
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const roadmapSchema = new Schema<IRoadmap>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    analysisId: {
      type: Schema.Types.ObjectId,
      ref: "Analysis",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
    },

    days: {
      type: [roadmapDaySchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRoadmap>(
  "Roadmap",
  roadmapSchema
);