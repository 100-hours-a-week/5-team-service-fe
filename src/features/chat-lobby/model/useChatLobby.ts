"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatLobbyInfo } from "./types";
import { useChatLobbySse } from "./useChatLobbySse";
import exitLobby from "../api/exit-lobby";
import startChat from "../api/start-chat";
import getChatLobbyInfo from "../api/get-lobby-info";

type JoinParams = { host?: boolean };

function readBootstrapLobby(roomId: number): ChatLobbyInfo | null {
  if (typeof window === "undefined") return null;

  const key = `chatLobby:bootstrap:${roomId}`;
  const raw = window.sessionStorage.getItem(key);
  if (!raw) return null;

  window.sessionStorage.removeItem(key);

  try {
    const parsed = JSON.parse(raw) as ChatLobbyInfo;
    if (parsed?.roomId !== roomId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useChatLobby(roomId: number, joinParams: JoinParams) {
  const [chatLobbyInfo, setChatLobbyInfo] = useState<ChatLobbyInfo | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const isJoining = false;
  const [isLeaving, setIsLeaving] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { start: startSse, stop: stopSse } = useChatLobbySse();

  const totalCapacity = useMemo(() => {
    const maxPerPosition = chatLobbyInfo?.maxPerPosition ?? 0;
    return maxPerPosition > 0 ? maxPerPosition * 2 : 0;
  }, [chatLobbyInfo?.maxPerPosition]);

  const currentCount = useMemo(
    () => (chatLobbyInfo?.agreeCount ?? 0) + (chatLobbyInfo?.disagreeCount ?? 0),
    [chatLobbyInfo?.agreeCount, chatLobbyInfo?.disagreeCount],
  );

  const progress = totalCapacity > 0 ? Math.round((currentCount / totalCapacity) * 100) : 0;
  const isHost = joinParams.host === true;

  const connectSse = useCallback(
    (targetRoomId: number, onNavigateChat: (rid: number) => void, onNavigateList: () => void) => {
      startSse(targetRoomId, {
        onUpdate: (nextLobbyInfo) => {
          setErrorMessage(null);
          setChatLobbyInfo(nextLobbyInfo);
        },
        onStarted: (rid) => {
          onNavigateChat(rid);
        },
        onCancelled: () => {
          setErrorMessage("방장이 나가서 채팅방이 취소되었어요.");
          onNavigateList();
        },
        onError: (msg) => {
          setErrorMessage(msg);
        },
      });
    },
    [startSse],
  );

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsBootstrapping(true);
      setErrorMessage(null);

      const bootstrapLobby = readBootstrapLobby(roomId);
      if (bootstrapLobby) {
        if (!cancelled) setChatLobbyInfo(bootstrapLobby);
        if (!cancelled) setIsBootstrapping(false);
        return;
      }

      try {
        const waiting = await getChatLobbyInfo({ roomId });
        if (cancelled) return;
        setChatLobbyInfo(waiting);
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          (error as { message?: string })?.message ?? "대기실 정보를 불러오지 못했어요.",
        );
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
      stopSse();
    };
  }, [roomId, stopSse]);

  const leave = useCallback(
    async (onNavigateList: () => void) => {
      setIsLeaving(true);
      stopSse();
      try {
        await exitLobby({ roomId });
      } catch (error) {
        setErrorMessage((error as { message?: string })?.message ?? "채팅 나가기에 실패했어요.");
      } finally {
        onNavigateList();
        setIsLeaving(false);
      }
    },
    [roomId, stopSse],
  );

  const start = useCallback(async () => {
    if (!isHost) {
      return;
    }

    setIsStarting(true);
    setErrorMessage(null);

    try {
      await startChat({ roomId });
    } catch (error) {
      setErrorMessage((error as { message?: string })?.message ?? "채팅 시작에 실패했어요.");
    } finally {
      setIsStarting(false);
    }
  }, [isHost, roomId]);

  return {
    chatLobbyInfo,
    isBootstrapping,
    isJoining,
    isLeaving,
    isStarting,
    isHost,
    errorMessage,
    progress,
    totalCapacity,
    currentCount,
    connectSse,
    leave,
    start,
  };
}
