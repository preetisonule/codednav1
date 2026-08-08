import { NextFunction, Request, Response } from 'express';

interface HttpError extends Error {
  status?: number;
  code?: string;
}

/**
 * Centralized error handler. Every controller forwards errors via `next(err)`
 * instead of formatting responses itself, so the JSON error shape is
 * consistent across the whole API (used by the client's ErrorMessage UI).
 */
export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status ?? 500;
  const message = err.message || 'Internal server error';

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('[CodeDNA API Error]', err);
  }

  res.status(status).json({
    status,
    message,
    code: err.code ?? (status === 404 ? 'NOT_FOUND' : status === 429 ? 'RATE_LIMITED' : 'INTERNAL_ERROR'),
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    status: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
}
