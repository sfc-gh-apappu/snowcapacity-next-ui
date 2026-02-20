import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface ApiResponse<T> {
  data: T;
  error?: { code: string; message: string; details?: unknown };
  meta: { requestId: string; timestamp: string; durationMs: number };
}

export interface PaginatedData<T> {
  items: T[];
  totalCount?: number;
  nextPageToken?: string;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok || body.error) {
    throw new Error(body.error?.message ?? `Request failed (${res.status})`);
  }

  return body.data;
}

/**
 * Typed wrapper around useQuery + apiFetch.
 * Data is cached by `path` and shared across components.
 */
export function useApiQuery<T>(
  path: string,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, Error>({
    queryKey: [path],
    queryFn: () => apiFetch<T>(path),
    ...options,
  });
}
