import { apiFetch } from "@/lib/api/apiFetch";
import { EditMeetingRequest, EditMeetingResponse } from "./types";

export default async function editMeeting({
  request,
  meetingId,
}: {
  request: EditMeetingRequest;
  meetingId: number;
}): Promise<EditMeetingResponse> {
  const requestUrl = `/meetings/${meetingId}`;
  return apiFetch<EditMeetingResponse>(requestUrl, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}
