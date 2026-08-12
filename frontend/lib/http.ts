import type { ApiResponse } from '@/lib/types'

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  status: number
  errors?: { field: string; message: string }[]

  constructor(message: string, status: number, errors?: { field: string; message: string }[]) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

interface RequestOptions extends RequestInit {
  /** Include the auth cookie — required for admin-only endpoints. */
  withCredentials?: boolean
}

/**
 * Thin wrapper around fetch that talks to the real backend, unwraps the
 * `{ success, message, data }` envelope, and throws a typed ApiError with a
 * human-readable message on failure.
 */
export async function apiFetch<T>(
  path: string,
  { withCredentials, headers, ...init }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: withCredentials ? 'include' : init.credentials,
      headers: {
        ...(init.body && !(init.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...headers,
      },
    })
  } catch {
    throw new ApiError('Unable to reach the server. Please try again.', 0)
  }

  let body: ApiResponse<T> | undefined
  try {
    body = await res.json()
  } catch {
    // no JSON body (e.g. 204) — fine for successful non-data responses
  }

  if (!res.ok || !body?.success) {
    throw new ApiError(
      body?.message || `Request failed (${res.status})`,
      res.status,
      body?.errors,
    )
  }

  return body
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof ApiError) return error.message
  return fallback
}
