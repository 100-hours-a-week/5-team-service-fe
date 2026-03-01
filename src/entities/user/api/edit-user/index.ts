import { apiFetch } from "@/lib/api/apiFetch";
import { EditUserProfileRequest, EditUserProfileResponse } from "./types";

export async function editUserProfile(
  request: EditUserProfileRequest,
): Promise<EditUserProfileResponse> {
  return apiFetch<EditUserProfileResponse>("/users/me", {
    method: "PUT",
    body: JSON.stringify(request),
  });
}
