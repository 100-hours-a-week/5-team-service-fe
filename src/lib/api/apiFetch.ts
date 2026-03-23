"use client";

import { ApiErrorResponse, ApiFetchOptions, ApiResponse } from "./types";
import { refreshAccessToken } from "../auth/refreshAccessToken";
import { authStore } from "@/shared/store/authStore";

function createApiError(message: string, status: number, code?: string) {
  const error = new Error(message) as Error & { code?: string; status?: number };
  error.status = status;
  if (code) {
    error.code = code;
  }
  return error;
}

export async function apiFetch<T>(path: string, init: ApiFetchOptions) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  const url = `${base}${path}`;
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? 5000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let parsedError: ApiErrorResponse | null = null;

  try {
    const accessToken = authStore.getAccessToken();
    const headers = new Headers(init.headers);

    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const response = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
      credentials: init.credentials ?? "include",
    });

    if (response.status === 401 && !init.skipRefresh && !init.retried) {
      let error: ApiErrorResponse | null = null;
      try {
        error = (await response.json()) as ApiErrorResponse;
      } catch {
        error = null;
      }
      parsedError = error;

      if (error?.code === "TOKEN_EXPIRED") {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          const retryHeaders = new Headers(init.headers);
          retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
          return apiFetch<T>(path, {
            ...init,
            headers: retryHeaders,
            signal: controller.signal,
            credentials: init.credentials ?? "include",
            retried: true,
          });
        }

        authStore.clear();
        throw createApiError("세션이 만료되었습니다. 다시 로그인해주세요", 401, error.code);
      }

      if (error?.code === "TOKEN_INVALID") {
        authStore.clear();
        throw createApiError("유효하지 않은 토큰입니다. 다시 로그인해주세요", 401, error.code);
      }

      if (error?.code === "AUTH_UNAUTHORIZED") {
        authStore.clear();
        throw createApiError("인증이 필요합니다.", 401, error.code);
      }
    }

    if (!response.ok) {
      if (!parsedError) {
        try {
          parsedError = (await response.json()) as ApiErrorResponse;
        } catch {
          parsedError = null;
        }
      }
      throw createApiError(
        parsedError?.message ?? `API 요청 실패: ${response.status}`,
        response.status,
        parsedError?.code,
      );
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
