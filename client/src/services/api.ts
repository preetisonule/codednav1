import axios, {
  AxiosError,
  type AxiosInstance,
} from "axios";

import type { ReadinessResponse } from "../types/readiness";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Accept: "application/json",
  },
});

export interface ApiError {
  status: number;
  message: string;
  code: string;
}

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(error: ApiError) {
    super(error.message);

    this.name = "ApiRequestError";
    this.status = error.status;
    this.code = error.code;
  }
}

function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    throw new ApiRequestError({
      status: error.response?.status ?? 500,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      code:
        error.response?.data?.code ||
        "API_ERROR",
    });
  }

  if (error instanceof Error) {
    throw new ApiRequestError({
      status: 500,
      message: error.message,
      code: "UNKNOWN",
    });
  }

  throw new ApiRequestError({
    status: 500,
    message: "Something went wrong",
    code: "UNKNOWN",
  });
}

/*
 * ============================================
 * GitHub API
 * ============================================
 */

export const githubApi = {
  async getProfile(username: string) {
    try {
      const response = await api.get(
        `/api/github/profile/${username}`
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getRepos(username: string) {
    try {
      const response = await api.get(
        `/api/github/repos/${username}`
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async analyze(username: string) {
    try {
      const response = await api.get(
        `/api/github/analyze/${username}`
      );

      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

/*
 * ============================================
 * Readiness API
 * ============================================
 */

export async function getReadiness(data: {
  githubUsername: string;
  leetcodeUsername?: string;
  targetRole?: string;
  preparationDays?: number;
  resume?: File;
}): Promise<ReadinessResponse> {
  try {
    const formData = new FormData();

    formData.append(
      "githubUsername",
      data.githubUsername
    );

    if (data.leetcodeUsername) {
      formData.append(
        "leetcodeUsername",
        data.leetcodeUsername
      );
    }

    if (data.targetRole) {
      formData.append(
        "targetRole",
        data.targetRole
      );
    }

    if (data.preparationDays) {
      formData.append(
        "preparationDays",
        String(data.preparationDays)
      );
    }

    if (data.resume) {
      formData.append(
        "resume",
        data.resume
      );
    }

    const response =
      await api.post<ReadinessResponse>(
        "/api/readiness/analyze",
        formData
      );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export default api;