"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ROUND_DURATION_SECONDS } from "../model/config";
import { useRouter } from "next/navigation";
import { useChatRoomSocket } from "../model/useChatRoomSocket";
import { useUserProfileQuery } from "@/entities/user/model/useUserProfileQuery";
import ChatRoomTopSection from "./ChatRoomTopSection";
import ChatRoomRoundBar from "./ChatRoomRoundBar";
import ChatRoomComposer from "./ChatRoomComposer";
import ChatRoomMyBubble from "./ChatRoomMyBubble";
import ChatRoomOtherBubble from "./ChatRoomOtherBubble";
import formatChatTime from "../lib/formatChatTime";

export default function ChatRoom({ roomId }: { roomId: number }) {
  const router = useRouter();
  const { profile } = useUserProfileQuery();
  const { roomInfo, messages, sendText, leaveRoom, isConnected, isBootstrapping, bootstrapError } =
    useChatRoomSocket(roomId);
  const [text, setText] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [remainingRoundSeconds, setRemainingRoundSeconds] = useState(ROUND_DURATION_SECONDS);
  const [isDiscussionEnded, setIsDiscussionEnded] = useState(false);

  const roomTitle = roomInfo?.topic ?? `채팅방 #${roomId}`;

  useEffect(() => {
    const container = messageListRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sent = sendText(text);
    if (sent) setText("");
  };

  const handleLeave = async () => {
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
        onOpenGuide={() => {}}
        onOpenLeaveConfirm={() => {}}
      />

      <section className="relative -mt-7 flex min-h-0 flex-1 flex-col rounded-t-[28px] bg-gray-purple shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
        <ChatRoomRoundBar
          currentRound={currentRound}
          remainingRoundSeconds={remainingRoundSeconds}
        />

        <main
          ref={messageListRef}
          className="no-scrollbar bg-gray-purple flex-1 overflow-y-auto px-4 py-4"
        >
          <div className="flex min-h-full flex-col justify-end">
            <div className="space-y-3">
              {isBootstrapping ? (
                <p className="text-center text-sm text-gray-400">채팅방을 불러오는 중입니다.</p>
              ) : null}
              {!isBootstrapping && bootstrapError ? (
                <p className="text-center text-sm text-red-500">{bootstrapError}</p>
              ) : null}
              {messages.map((message) => {
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
              {!isBootstrapping && !bootstrapError && messages.length === 0 ? (
                <p className="text-center text-caption text-gray-400">아직 메시지가 없습니다.</p>
              ) : null}
            </div>
          </div>
        </main>

        <ChatRoomComposer
          text={text}
          isConnected={isConnected}
          isDiscussionEnded={isDiscussionEnded}
          onChangeText={setText}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
}
