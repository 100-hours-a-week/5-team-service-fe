"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatLobby } from "@/features/chat-lobby/model/useChatLobby";
import { ChatLobby } from "@/features/chat-lobby/ui/ChatLobby";

export default function Page({ roomId }: { roomId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hostQuerySuffix = useMemo(() => {
    const hostParam = searchParams.get("host");
    return hostParam === "1" || hostParam === "true" ? "?host=1" : "";
  }, [searchParams]);

  const joinParams = useMemo(() => {
    const host = hostQuerySuffix === "?host=1";

    return { host };
  }, [hostQuerySuffix]);

  const chatLobbySse = useChatLobby(roomId, joinParams);
  const { connectSse, leave } = chatLobbySse;

  useEffect(() => {
    connectSse(
      roomId,
      (rid) => {
        router.replace(`/chats/${rid}${hostQuerySuffix}`);
      },
      () => {
        router.replace("/chats");
      },
    );
  }, [roomId, connectSse, hostQuerySuffix, router]);

  return (
    <ChatLobby
      chatLobbyInfo={chatLobbySse.chatLobbyInfo}
      isBootstrapping={chatLobbySse.isBootstrapping}
      isJoining={chatLobbySse.isJoining}
      isLeaving={chatLobbySse.isLeaving}
      isStarting={chatLobbySse.isStarting}
      isHost={chatLobbySse.isHost}
      errorMessage={chatLobbySse.errorMessage}
      progress={chatLobbySse.progress}
      totalCapacity={chatLobbySse.totalCapacity}
      currentCount={chatLobbySse.currentCount}
      onLeave={() => leave(() => router.replace("/chats"))}
      onStart={() => {
        void chatLobbySse.start();
      }}
    />
  );
}
