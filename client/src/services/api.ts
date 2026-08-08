import axios from 'axios';
import { AnalysisResult, ApiErrorShape, GithubRepo, GithubUser } from '@/types';

/**
 * Single axios instance + typed API layer.
 * Components/hooks never call axios directly — everything goes through
 * these functions so base URL, timeouts, and error shape stay consistent.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 20_000,
});

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.status = shape.status;
    this.code = shape.code;
  }
}

async function request<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await promise;
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      throw new ApiRequestError(err.response.data as ApiErrorShape);
    }
    if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
      throw new ApiRequestError({ status: 504, message: 'Request timed out. Please try again.', code: 'TIMEOUT' });
    }
    throw new ApiRequestError({ status: 0, message: 'Network error — is the API server running?', code: 'NETWORK_ERROR' });
  }
}

export const githubApi = {
  getProfile: (username: string) => request<GithubUser>(client.get(`/github/${username}/profile`)),
  getRepos: (username: string) => request<GithubRepo[]>(client.get(`/github/${username}/repos`)),
  analyze: (username: string) => request<AnalysisResult>(client.get(`/github/${username}/analyze`)),
};
