/**
 * Core API Client & Request Wrappers
 * Handles REST and GraphQL requests with standardized response envelopes,
 * authentication headers, error handling, and type safety.
 */

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  isSuccess: boolean;
}

export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLResponseError {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: (string | number)[];
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLResponseError[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URI || `${BACKEND_URL}/graphql`;

/**
 * Standardized Fetch wrapper for REST endpoints
 */
export async function fetchRest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = path.startsWith("http") ? path : `${BACKEND_URL}${path}`;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      return {
        data: null,
        error: (data && data.message) || response.statusText || "Request failed",
        status: response.status,
        isSuccess: false,
      };
    }

    return {
      data: data as T,
      error: null,
      status: response.status,
      isSuccess: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error occurred";
    return {
      data: null,
      error: message,
      status: 0,
      isSuccess: false,
    };
  }
}

/**
 * Direct isomorphic GraphQL query/mutation execution
 * Can be used in Server Components, Server Actions, or Client functions.
 */
export async function fetchGraphQL<TData = unknown, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  options: RequestInit = {}
): Promise<ApiResponse<TData>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
      ...options,
    });

    const result: GraphQLResponse<TData> = await response.json();

    if (result.errors && result.errors.length > 0) {
      const errorMsg = result.errors.map((e) => e.message).join("; ");
      return {
        data: result.data || null,
        error: errorMsg,
        status: response.status,
        isSuccess: false,
      };
    }

    return {
      data: result.data || null,
      error: null,
      status: response.status,
      isSuccess: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "GraphQL network error";
    return {
      data: null,
      error: message,
      status: 0,
      isSuccess: false,
    };
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    fetchRest<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    fetchRest<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    fetchRest<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    fetchRest<T>(path, { method: "DELETE", ...options }),

  graphql: fetchGraphQL,
};
