import { authStore } from "../store/authStore";
import { ensureAccessToken } from "./ensureAccessToken";

export default async function initAuth(pathname: string) {
  if (pathname.startsWith("/oauth")) {
    authStore.setInitialized(true);
    return;
  }

  await ensureAccessToken();
  authStore.setInitialized(true);
}
