import * as Sentry from "@sentry/nextjs";
import { ApiErrorResponse, ApiFetchOptions, ApiResponse } from "./types";

export async function serverApiFetch<T>(path: string, init: ApiFetchOptions = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    const error = new Error("NEXT_PUBLIC_API_BASE_URL is not set");
    Sentry.captureException(error, {
      tags: { area: "serverApiFetch", reason: "missing_env" },
      extra: { envKey: "NEXT_PUBLIC_API_BASE_URL", path, method: init.method ?? "GET" },
    });
    throw error;
  }

  const url = `${base}${path}`;
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? 5000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let parsedError: ApiErrorResponse | null = null;

  try {
    const headers = new Headers(init.headers);

    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
      credentials: init.credentials ?? "include",
      cache: init.cache ?? "no-store",
    });

    if (!response.ok) {
      try {
        parsedError = (await response.json()) as ApiErrorResponse;
      } catch {
        parsedError = null;
      }
      const customError = new Error(parsedError?.message ?? `API 요청 실패: ${response.status}`);
      if (parsedError?.code) {
        (customError as { code?: string }).code = parsedError.code;
      }
      (customError as { status?: number }).status = response.status;
      throw customError;
    }

    if (response.status === 204) {
      return null as T;
    }

    const body = (await response.json()) as ApiResponse<T>;
    return body.data;
  } finally {
    clearTimeout(timeoutId);
  }
}
