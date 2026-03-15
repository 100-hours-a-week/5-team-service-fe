import { apiFetch } from "@/lib/api/apiFetch";
import {
  GetMeetingParticipationStatusReqeust,
  GetMeetingParticipationStatusResponse,
} from "../model/types";

export default function getMeetingParticipationStatus(
  request: GetMeetingParticipationStatusReqeust,
): Promise<GetMeetingParticipationStatusResponse> {
  const { meetingId } = request;
  const requestUrl = `/meetings/${meetingId}/participation-status`;
  return apiFetch<GetMeetingParticipationStatusResponse>(requestUrl, {
    method: "GET",
  });
}
