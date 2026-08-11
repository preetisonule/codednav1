import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;

  targetRole: string;
  preparationDays: number;

  readiness: {
    overallScore: number;
    status: string;
    categoryScores: Record<string, number>;
    recommendations: string[];
  };

  skillGaps: Array<{
    skill: string;
    category: string;
    currentLevel: string;
    priority: string;
    score: number;
    reason: string;
    recommendedAction: string;
  }>;

  roadmap: {
    targetRole: string;
    totalDays: number;
    days: Array<{
      day: number;
      focus: string;
      tasks: Array<{
        title: string;
        description: string;
        estimatedHours: number;
        category: string;
      }>;
    }>;
  };

  github: unknown;
  resume: unknown;
  leetcode: unknown;

  createdAt: Date;
  updatedAt: Date;
}

const skillGapSchema = new Schema(
  {
    skill: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    currentLevel: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    recommendedAction: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const analysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    preparationDays: {
      type: Number,
      required: true,
    },

    readiness: {
      overallScore: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        required: true,
      },

      categoryScores: {
        type: Map,
        of: Number,
        default: {},
      },

      recommendations: {
        type: [String],
        default: [],
      },
    },

    skillGaps: {
  type: [skillGapSchema],
  default: [],
},

    roadmap: {
      type: Schema.Types.Mixed,
      required: true,
    },

    github: {
      type: Schema.Types.Mixed,
      default: null,
    },

    resume: {
      type: Schema.Types.Mixed,
      default: null,
    },

    leetcode: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model<IAnalysis>(
  "Analysis",
  analysisSchema
);

export default Analysis;