import { apiFetch } from "@/lib/api/apiFetch";

export default function createMeetingBookmark({ meetingId }: { meetingId: number }) {
  const requestUrl = `/meetings/${meetingId}/bookmarks`;
  return apiFetch<null>(requestUrl, {
    method: "POST",
  });
}
