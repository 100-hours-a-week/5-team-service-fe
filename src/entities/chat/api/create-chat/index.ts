import { apiFetch } from "@/lib/api/apiFetch";
import { CreateChatRequest, CreateChatResponse } from "./types";

export async function createChat(request: CreateChatRequest): Promise<CreateChatResponse> {
  return apiFetch<CreateChatResponse>("/chat-rooms", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
