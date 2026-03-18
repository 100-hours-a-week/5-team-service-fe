import { apiFetch } from "@/lib/api/apiFetch";

export default function participateMeeting({ meetingId }: { meetingId: number }) {
  const requestUrl = `/meetings/${meetingId}/participations`;
  return apiFetch<null>(requestUrl, {
    method: "POST",
  });
}
