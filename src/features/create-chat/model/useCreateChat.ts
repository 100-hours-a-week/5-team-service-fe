"use client";

import { useForm } from "react-hook-form";
import { CreateChatFormValues } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateChatSchema } from "./schema";
import { CreateChatRequest, CreateChatResponse } from "@/entities/chat/api/create-chat/types";
import { createChat } from "@/entities/chat/api/create-chat";
import { captureException } from "@sentry/nextjs";
import { useRouter } from "next/navigation";
import { createChatDefaultValues } from "./types";
import { useCreateChatStore } from "./store";

export function useCreateChat() {
  const router = useRouter();
  const createChatDraftValues = useCreateChatStore((s) => s.values);
  const resetCreateChatDraftValues = useCreateChatStore((s) => s.reset);

  const createChatForm = useForm<CreateChatFormValues>({
    resolver: zodResolver(CreateChatSchema),
    defaultValues: createChatDraftValues ?? createChatDefaultValues,
    mode: "onChange",
    shouldFocusError: true,
  });

  const handleSubmit = createChatForm.handleSubmit(async (values) => {
    try {
      const request: CreateChatRequest = {
        topic: values.topic,
        description: values.description,
        isbn: values.isbn,
        capacity: values.capacity,
        position: values.position,
        quiz: values.quiz,
      };

      const createChatResponse: CreateChatResponse = await createChat(request);
      const { roomId } = createChatResponse;

      resetCreateChatDraftValues();
      router.push(`/chats/${roomId}/lobby?host=1`);
    } catch (error) {
      captureException(error, { tags: { feature: "create-chat" } });
    }
  });

  return { createChatForm, handleSubmit };
}
