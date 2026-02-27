"use client";

import { useCallback, useRef } from "react";
import { authStore } from "@/shared/store/authStore";
import { captureException } from "@sentry/nextjs";
import type { ChatLobbyInfo, ChatLobbyStartResponse } from "./types";
import { normalizeBase, parseSseEvent } from "@/shared/lib/parseSseEvent";

type ChatLobbySseHandlers = {
  onUpdate: (next: ChatLobbyInfo) => void;
  onStarted: (roomId: number) => void;
  onCancelled: () => void;
  onError?: (message: string) => void;
};

export function useChatLobbySse() {
  const abortRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    void readerRef.current?.cancel();
    readerRef.current = null;
  }, []);

  const start = useCallback(
    async (roomId: number, handlers: ChatLobbySseHandlers) => {
      let terminalEventHandled = false;
      const base = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!base) {
        handlers.onError?.("API Base URL이 설정되지 않았어요.");
        return;
      }

      stop();
      const controller = new AbortController();
      abortRef.current = controller;

      const url = `${normalizeBase(base)}/chat-rooms/${roomId}/waiting-room/subscribe`;
      const accessToken = authStore.getAccessToken();

      try {
        const headers = new Headers();
        headers.set("Accept", "text/event-stream");
        if (accessToken) {
          headers.set(
            "Authorization",
            accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`,
          );
        }

        const res = await fetch(url, {
          method: "GET",
          headers,
          credentials: "include",
          signal: controller.signal,
        });
        console.log("[chat-lobby:debug] sse fetch response", {
          status: res.status,
          ok: res.ok,
        });

        if (!res.ok || !res.body) {
          handlers.onError?.(`SSE 연결 중 오류가 발생했어요. (${res.status})`);
          return;
        }

        const reader = res.body.getReader();
        readerRef.current = reader;
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        const consumeChunk = (rawChunk: string) => {
          const parsed = parseSseEvent(rawChunk);
          if (!parsed) return;

          if (parsed.event === "waiting-room-update") {
            if (!parsed.data) return;
            try {
              handlers.onUpdate(JSON.parse(parsed.data) as ChatLobbyInfo);
            } catch {}
          }

          if (parsed.event === "room-started") {
            let startedRoomId = roomId;
            if (parsed.data) {
              try {
                const started = JSON.parse(parsed.data) as ChatLobbyStartResponse;
                startedRoomId = started.roomId ?? roomId;
              } catch {}
            }
            terminalEventHandled = true;
            handlers.onStarted(startedRoomId);
            stop();
          }

          if (parsed.event === "room-cancelled") {
            terminalEventHandled = true;
            handlers.onCancelled();
            stop();
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            if (buffer.trim()) {
              consumeChunk(buffer);
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split(/\r?\n\r?\n/);
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            consumeChunk(chunk);
            if (terminalEventHandled) {
              return;
            }
          }
        }
      } catch (e) {
        if (terminalEventHandled) return;
        if ((e as { name?: string })?.name === "AbortError") return;
        captureException(e, {
          tags: { feature: "chat-lobby-sse" },
          extra: {
            roomId,
            sseUrl: url,
          },
        });

        handlers.onError?.("SSE 연결 중 오류가 발생했어요.");
      } finally {
        readerRef.current = null;
      }
    },
    [stop],
  );

  return { start, stop };
}

export const useWaitingRoomSse = useChatLobbySse;
