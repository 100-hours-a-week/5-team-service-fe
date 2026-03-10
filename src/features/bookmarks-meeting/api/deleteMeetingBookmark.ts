import { apiFetch } from "@/lib/api/apiFetch";

export default function deleteMeetingBookmark({ meetingId }: { meetingId: number }) {
  const requestUrl = `/meetings/${meetingId}/bookmarks`;
  return apiFetch<null>(requestUrl, {
    method: "DELETE",
  });
}
