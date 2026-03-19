import { apiFetch } from "@/lib/api/apiFetch";
import { GetChatRoomQuizRequest, GetChatRoomQuizResponse } from "../model/types";

export default async function getChatRoomQuiz(
  request: GetChatRoomQuizRequest,
): Promise<GetChatRoomQuizResponse> {
  const { roomId } = request;
  const requestUrl = `/chat-rooms/${roomId}/quiz`;
  return apiFetch(requestUrl, {
    method: "GET",
  });
}
