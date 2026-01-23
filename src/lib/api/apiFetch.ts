import { authStore } from "@/stores/authStore";
import { ApiResponse } from "./types";

type ApiFetchOptions = RequestInit & { timeoutMs?: number };

export async function apiFetch<T>(path: string, init: ApiFetchOptions = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  const url = `${base}${path}`;
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? 5000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
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
