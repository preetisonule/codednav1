import { useCallback, useState } from 'react';
import { AnalysisResult } from '@/types';
import { ApiRequestError, githubApi } from '@/services/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseGithubAnalysisState {
  status: Status;
  data: AnalysisResult | null;
  error: ApiRequestError | null;
  username: string | null;
}

/**
 * Encapsulates the fetch lifecycle for a GitHub analysis request so
 * pages/components stay declarative (status + data) instead of juggling
 * loading/error booleans themselves.
 */
export function useGithubAnalysis() {
  const [state, setState] = useState<UseGithubAnalysisState>({
    status: 'idle',
    data: null,
    error: null,
    username: null,
  });

  const analyze = useCallback(async (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setState({ status: 'loading', data: null, error: null, username: trimmed });

    try {
      const data = await githubApi.analyze(trimmed);
      setState({ status: 'success', data, error: null, username: trimmed });
    } catch (err) {
      const apiError =
        err instanceof ApiRequestError
          ? err
          : new ApiRequestError({ status: 500, message: 'Something went wrong', code: 'UNKNOWN' });
      setState({ status: 'error', data: null, error: apiError, username: trimmed });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null, username: null });
  }, []);

  return { ...state, analyze, reset };
}
