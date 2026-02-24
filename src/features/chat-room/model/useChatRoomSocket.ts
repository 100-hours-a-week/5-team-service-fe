"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { stompManager } from "@/shared/lib/stomp/stompManager";
import {
  ChatRoomMessageInbound,
  ChatRoomMessageOutbound,
  StompConnectionState,
} from "@/shared/lib/stomp/types";
import { resolveStompConnectOptions } from "@/shared/lib/stomp/resolveStompConnectOptions";
import { stompDestinations } from "@/shared/lib/stomp/destinations";
import exitChatRoom from "../api/exit-chat-room";
import getChatRoomInfo from "../api/get-chat-room-info";
import { GetChatRoomInfoResponse } from "../api/get-chat-room-info/types";
import { getChatMessage } from "../api/get-chat-messages";

function extractMessages(messages: ChatRoomMessageInbound[]): ChatRoomMessageInbound[] {
  const normalized = messages.filter((item): item is ChatRoomMessageInbound => item !== null);

  return normalized.sort((a, b) => {
    if (a.messageId !== b.messageId) return a.messageId - b.messageId;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function useChatRoomSocket(roomId: number) {
  const [messages, setMessages] = useState<ChatRoomMessageInbound[]>([]);
  const [roomInfo, setRoomInfo] = useState<GetChatRoomInfoResponse | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<StompConnectionState>(
    stompManager.getState(),
  );
  const subscriptionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = stompManager.addStateListener(setConnectionState);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrapAndConnect = async () => {
      setIsBootstrapping(true);
      setBootstrapError(null);

      try {
        const roomInfo = await getChatRoomInfo({ roomId });
        if (!cancelled) setRoomInfo(roomInfo);
      } catch (error) {
        if (!cancelled) {
          setBootstrapError(
            (error as { message?: string })?.message ?? "채팅방 정보를 불러오지 못했습니다.",
          );
        }
      }

      try {
        const restoredMessages = await getChatMessage({ roomId: roomId });
        if (!cancelled) {
          setMessages(extractMessages(restoredMessages.messages));
        }
      } catch (error) {
        if (!cancelled) {
          setBootstrapError(
            (error as { message?: string })?.message ?? "이전 메시지를 불러오지 못했어요.",
          );
        }
      }

      const options = resolveStompConnectOptions();
      if (!options) {
        if (!cancelled) {
          setBootstrapError("웹소켓 연결 설정에 오류가 발생했습니다.");
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        await stompManager.connect(options);

        if (cancelled) return;

        const key = stompManager.subscribeJson<ChatRoomMessageInbound>(
          stompDestinations.topicChatRoom(roomId),
          (payload) => {
            setMessages((prev) => {
              if (prev.some((item) => item.messageId === payload.messageId)) {
                return prev;
              }
              return [...prev, payload];
            });
          },
        );

        subscriptionKeyRef.current = key;
      } catch {
        if (!cancelled) {
          setBootstrapError("STOMP 실시간 채팅 연결에 실패했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrapAndConnect();

    return () => {
      cancelled = true;
      if (subscriptionKeyRef.current) {
        stompManager.unsubscribe(subscriptionKeyRef.current);
        subscriptionKeyRef.current = null;
      }
    };
  }, [roomId]);

  const sendText = useCallback(
    (text: string) => {
      if (stompManager.getState() !== "connected") return false;

      const trimmed = text.trim();
      if (!trimmed) return false;

      const payload: ChatRoomMessageOutbound = {
        clientMessageId: crypto.randomUUID(),
        messageType: "TEXT",
        textMessage: trimmed,
        filePath: null,
      };

      try {
        stompManager.publishJson(stompDestinations.appChatRoomMessages(roomId), payload);
        return true;
      } catch {
        setChatError("메세지 전송에 실패했습니다. 다시 시도해주세요.");
        return false;
      }
    },
    [roomId],
  );

  const leaveRoom = useCallback(async () => {
    try {
      await exitChatRoom({ roomId });
    } catch {
      setChatError("나가기에 실패했습니다. 다시 시도해주세요.");
    } finally {
      if (subscriptionKeyRef.current) {
        stompManager.unsubscribe(subscriptionKeyRef.current);
        subscriptionKeyRef.current = null;
      }
      await stompManager.disconnect();
    }
  }, [roomId]);

  return {
    roomInfo,
    messages,
    isBootstrapping,
    bootstrapError,
    chatError,
    connectionState,
    sendText,
    leaveRoom,
    isConnected: connectionState === "connected",
  };
}
