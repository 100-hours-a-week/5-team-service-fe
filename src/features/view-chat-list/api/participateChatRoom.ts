import { apiFetch } from "@/lib/api/apiFetch";
import { ParticipateChatRoomRequest, ParticipateChatRoomResponse } from "../model/types";

export default async function participateChatRoom({
  roomId,
  ...request
}: ParticipateChatRoomRequest): Promise<ParticipateChatRoomResponse> {
  const requestUrl = `/chat-rooms/${roomId}/members`;
  return apiFetch<ParticipateChatRoomResponse>(requestUrl, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
