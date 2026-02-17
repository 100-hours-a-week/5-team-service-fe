import { refreshAccessToken } from "../api/refreshAccessToken";
import { authStore } from "../store/authStore";

let refreshing: Promise<string | null> | null = null;

export async function ensureAccessToken(): Promise<string | null> {
  const existingToken = authStore.getAccessToken();
  if (existingToken) return existingToken;

  if (!refreshing) {
    refreshing = (async () => {
      try {
        const token = await refreshAccessToken();
        return token ?? null;
      } catch {
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }

  return refreshing;
}
