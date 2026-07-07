import { env } from "@/lib/env";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const base =
    path.startsWith("/api/") || path.startsWith("/api")
      ? env.NEXT_PUBLIC_APP_URL
      : env.NEXT_PUBLIC_API_BASE_URL;
  const url = new URL(path, base);

  if (!query) {
    return url.toString();
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  { body, headers, query, ...init }: RequestOptions = {}
) {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body:
      body && typeof body === "object" && !(body instanceof FormData)
        ? JSON.stringify(body)
        : body,
  });

  if (!response.ok) {
    const text = await response.text();
    let payload: unknown = text;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = text;
    }

    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : text || `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  if (response.status === 204) {
    return null as T;
  }

  if (response.headers.get("content-type")?.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}
