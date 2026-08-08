import axios, { AxiosInstance, isAxiosError } from 'axios';
import { env } from '../config/env';
import { GithubRepo, GithubUser } from '../types';

/**
 * Thin wrapper around the GitHub REST API.
 * Controllers never call axios directly — they go through this service,
 * so auth headers, base URL, and error translation live in one place.
 */
class GithubService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.github.baseUrl,
      timeout: 10_000,
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(env.github.token ? { Authorization: `Bearer ${env.github.token}` } : {}),
      },
    });
  }

  async getUser(username: string): Promise<GithubUser> {
    try {
      const { data } = await this.client.get<GithubUser>(`/users/${username}`);
      return data;
    } catch (err) {
      throw this.translateError(err, username);
    }
  }

  /**
   * Fetches up to 200 repos (2 pages of 100), sorted by last-updated,
   * which is enough for the score/analytics without hammering rate limits.
   */
  async getRepos(username: string): Promise<GithubRepo[]> {
    try {
      const pages = await Promise.all(
        [1, 2].map((page) =>
          this.client.get<GithubRepo[]>(`/users/${username}/repos`, {
            params: { per_page: 100, page, sort: 'updated', type: 'owner' },
          })
        )
      );
      return pages.flatMap((res) => res.data);
    } catch (err) {
      throw this.translateError(err, username);
    }
  }

  private translateError(err: unknown, username: string): Error & { status?: number } {
    if (isAxiosError(err)) {
      if (err.response?.status === 404) {
        const notFound = new Error(`GitHub user "${username}" was not found`) as Error & {
          status?: number;
        };
        notFound.status = 404;
        return notFound;
      }
      if (err.response?.status === 403) {
        const rateLimited = new Error(
          'GitHub API rate limit exceeded. Add a GITHUB_TOKEN to raise the limit.'
        ) as Error & { status?: number };
        rateLimited.status = 429;
        return rateLimited;
      }
      if (err.code === 'ECONNABORTED') {
        const timeout = new Error('GitHub API request timed out') as Error & { status?: number };
        timeout.status = 504;
        return timeout;
      }
    }
    const generic = new Error('Unexpected error contacting GitHub API') as Error & {
      status?: number;
    };
    generic.status = 502;
    return generic;
  }
}

export const githubService = new GithubService();
