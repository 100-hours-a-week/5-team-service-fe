import { apiFetch } from "@/lib/api/apiFetch";
import { EndChatRoomRequest } from "./types";

export default async function endChatRoom({ roomId }: EndChatRoomRequest) {
  return apiFetch<null>(`/chat-rooms/${roomId}`, {
    method: "DELETE",
  });
}
