"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUND_DURATION_SECONDS, TOTAL_ROUNDS } from "../model/config";
import { useChatRoomSocket } from "../model/useChatRoomSocket";
import { useUserProfileQuery } from "@/entities/user/model/useUserProfileQuery";
import ChatRoomTopSection from "./ChatRoomTopSection";
import ChatRoomRoundBar from "./ChatRoomRoundBar";
import ChatRoomHostActions from "./ChatRoomHostActions";
import ChatRoomComposer from "./ChatRoomComposer";
import ChatRoomMyBubble from "./ChatRoomMyBubble";
import ChatRoomOtherBubble from "./ChatRoomOtherBubble";
import ChatRoomInfoModal from "./ChatRoomInfoModal";
import ChatRoomLeaveConfirmModal from "./ChatRoomLeaveConfirmModal";
import formatChatTime from "../lib/formatChatTime";
import nextRound from "../api/next-round";
import endChatRoom from "../api/end-chat-room";

export default function ChatRoom({ roomId }: { roomId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useUserProfileQuery();
  const {
    roomInfo,
    messages,
    currentRound,
    roomEnded,
    sendText,
    leaveRoom,
    isConnected,
    isBootstrapping,
    bootstrapError,
  } = useChatRoomSocket(roomId);
  const [text, setText] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [remainingRoundSeconds, setRemainingRoundSeconds] = useState(ROUND_DURATION_SECONDS);
  const [isAdvancingRound, setIsAdvancingRound] = useState(false);
  const [isEndingChat, setIsEndingChat] = useState(false);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const autoTriggeredRoundRef = useRef<number | null>(null);
  const hasSeenPositiveTimeRef = useRef(false);

  const isHost = searchParams.get("host") === "1" || searchParams.get("host") === "true";
  const roomTitle = roomInfo?.topic ?? `채팅방 #${roomId}`;
  const canGoNextRound = currentRound < TOTAL_ROUNDS;
  const canEndChat = currentRound === TOTAL_ROUNDS;
  const visibleMessages = messages.filter(
    (message) => message.messageType === "TEXT" && Boolean(message.textMessage?.trim()),
  );

  useEffect(() => {
    const container = messageListRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    autoTriggeredRoundRef.current = null;
    hasSeenPositiveTimeRef.current = false;
    setRemainingRoundSeconds(ROUND_DURATION_SECONDS);
  }, [currentRound]);

  useEffect(() => {
    if (roomEnded) return;
    const timer = window.setInterval(() => {
      setRemainingRoundSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [currentRound, roomEnded]);

  useEffect(() => {
    if (remainingRoundSeconds > 0) {
      hasSeenPositiveTimeRef.current = true;
    }
  }, [remainingRoundSeconds]);

  const handleNextRound = useCallback(async () => {
    if (!isHost || !canGoNextRound || isAdvancingRound) return;

    setIsAdvancingRound(true);
    try {
      await nextRound({ roomId });
    } finally {
      setIsAdvancingRound(false);
    }
  }, [canGoNextRound, isAdvancingRound, isHost, roomId]);

  const handleEndChat = useCallback(async () => {
    if (!isHost || !canEndChat || isEndingChat) return;

    setIsEndingChat(true);
    try {
      await endChatRoom({ roomId });
    } finally {
      setIsEndingChat(false);
    }
  }, [canEndChat, isEndingChat, isHost, roomId]);

  useEffect(() => {
    if (!isHost || !canGoNextRound || isAdvancingRound) return;
    if (remainingRoundSeconds > 0) return;
    if (!hasSeenPositiveTimeRef.current) return;
    if (autoTriggeredRoundRef.current === currentRound) return;

    autoTriggeredRoundRef.current = currentRound;
    void handleNextRound();
  }, [
    canGoNextRound,
    currentRound,
    handleNextRound,
    isAdvancingRound,
    isHost,
    remainingRoundSeconds,
  ]);

  useEffect(() => {
    if (!roomEnded) return;
    router.replace(`/chat/${roomId}/result`);
  }, [roomEnded, roomId, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sent = sendText(text);
    if (sent) setText("");
  };

  const handleLeave = async () => {
    setIsLeaveConfirmOpen(false);
    setIsLeaving(true);
    await leaveRoom();
    router.push("/chats");
    setIsLeaving(false);
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[#eef1f7]">
      <ChatRoomTopSection
        isConnected={isConnected}
        roomTitle={roomTitle}
        isLeaving={isLeaving}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenLeaveConfirm={() => setIsLeaveConfirmOpen(true)}
      />

      <section className="relative -mt-7 flex min-h-0 flex-1 flex-col rounded-t-[28px] bg-gray-purple shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
        <ChatRoomRoundBar
          currentRound={currentRound}
          remainingRoundSeconds={remainingRoundSeconds}
        />

        {isHost ? (
          <ChatRoomHostActions
            canGoNextRound={canGoNextRound}
            isAdvancingRound={isAdvancingRound}
            onNextRound={() => void handleNextRound()}
            canEndChat={canEndChat}
            isEndingChat={isEndingChat}
            onEndChat={() => void handleEndChat()}
          />
        ) : null}

        <main
          ref={messageListRef}
          className="no-scrollbar bg-gray-purple flex-1 overflow-y-auto px-4 py-4"
        >
          <div className="flex min-h-full flex-col justify-end">
            <div className="space-y-3">
              {visibleMessages.map((message) => {
                const isMine = Boolean(
                  profile?.nickname &&
                  message.senderNickname &&
                  profile.nickname === message.senderNickname,
                );
                const timeText = formatChatTime(message.createdAt);

                return (
                  <div key={message.messageId}>
                    {isMine ? (
                      <ChatRoomMyBubble textMessage={message.textMessage} timeText={timeText} />
                    ) : (
                      <ChatRoomOtherBubble
                        senderNickname={message.senderNickname}
                        textMessage={message.textMessage}
                        timeText={timeText}
                      />
                    )}
                  </div>
                );
              })}
              {isBootstrapping ? (
                <p className="text-center text-sm text-gray-400">채팅방을 불러오는 중입니다.</p>
              ) : null}
              {!isBootstrapping && !bootstrapError && visibleMessages.length === 0 ? (
                <p className="text-center text-caption text-gray-400">아직 메시지가 없습니다.</p>
              ) : null}
              {!isBootstrapping && bootstrapError ? (
                <p className="text-center text-sm text-red-500">{bootstrapError}</p>
              ) : null}
            </div>
          </div>
        </main>

        <ChatRoomComposer
          text={text}
          isConnected={isConnected}
          isDiscussionEnded={roomEnded}
          onChangeText={setText}
          onSubmit={handleSubmit}
        />
      </section>

      <ChatRoomInfoModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        currentRound={currentRound}
        isDiscussionEnded={false}
        agreeMembers={roomInfo?.agreeMembers ?? []}
        disagreeMembers={roomInfo?.disagreeMembers ?? []}
      />

      <ChatRoomLeaveConfirmModal
        isOpen={isLeaveConfirmOpen}
        isLeaving={isLeaving}
        onClose={() => setIsLeaveConfirmOpen(false)}
        onConfirm={() => void handleLeave()}
      />
    </div>
  );
}
