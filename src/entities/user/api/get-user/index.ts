import { apiFetch } from "@/lib/api/apiFetch";
import { GetUserProfileResponse } from "./types";

export async function getUser(): Promise<GetUserProfileResponse> {
  return apiFetch<GetUserProfileResponse>("/users/me", {
    method: "GET",
  });
}
