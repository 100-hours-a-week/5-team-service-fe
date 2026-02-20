"use client";

import useChats from "../model/useChats";
import ChatCard from "./ChatCard";
import { Skeleton } from "./Skeleton";

export default function ChatList() {
  const {
    chats,
    isError,
    hasNextPage,
    sentinelRef,
    onClickChat,
    showInitSkeleton,
    showNextSkeleton,
  } = useChats();

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col gap-4 px-4 pb-8">
      <div className="flex flex-col gap-1 px-2">
        <p className="text-subheading">
          <span className="text-primary">채팅 토론</span>방
        </p>
        <p className="text-label !font-[400] text-gray-400">
          독서의 끝은 대화! 찬반 토론에 참여해보세요.
        </p>
      </div>

      {isError ? (
        <div className="flex flex-col flex-1 py-10 text-center text-sm text-gray-400">
          채팅방을 불러오지 못했어요.
        </div>
      ) : null}

      {showInitSkeleton
        ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={`init-${i}`} />)
        : null}

      {chats.map((chat, index) => (
        <ChatCard
          key={chat.roomId}
          roomName={chat.topic}
          description={chat.description}
          currentMembers={chat.currentMemberCount}
          capacity={chat.capacity}
          bookTitle={chat.bookTitle}
          bookAuthor={chat.bookAuthors}
          bookThumbnailUrl={chat.bookThumbnailUrl}
          onJoin={() => onClickChat(index, chat.roomId)}
        />
      ))}

      {showNextSkeleton
        ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={`next-${i}`} />)
        : null}

      <div ref={sentinelRef} />
    </div>
  );
}
