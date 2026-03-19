"use client";

import { useEffect, useRef, useState } from "react";
import useChats from "../model/useChats";
import ChatCard from "./ChatCard";
import { Skeleton } from "./Skeleton";
import { apiFetch } from "@/lib/api/apiFetch";
import type { ChatLobbyInfo } from "@/features/chat-lobby/model/types";
import ChatEnterModal from "./ChatEnterModal";

type JoinPosition = "AGREE" | "DISAGREE";
type JoinStep = "NONE" | "POSITION" | "QUIZ";
type ChatQuiz = {
  question: string;
  choices: { choiceNumber: number; choiceText: string }[];
  agreeCount: number;
  disagreeCount: number;
  maxPerPosition: number;
};

const MODAL_EXIT_MS = 220;

export default function ChatList() {
  const { chats, isError, sentinelRef, onClickChat, showInitSkeleton, showNextSkeleton } =
    useChats();
  const [joinStep, setJoinStep] = useState<JoinStep>("NONE");
  const [closingStep, setClosingStep] = useState<JoinStep>("NONE");
  const [pendingJoin, setPendingJoin] = useState<{ index: number; roomId: number } | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<JoinPosition | null>(null);
  const [selectedChoiceNumber, setSelectedChoiceNumber] = useState<number | null>(null);
  const [isEnteringLobby, setIsEnteringLobby] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quiz, setQuiz] = useState<ChatQuiz | null>(null);
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const currentModalStep = joinStep !== "NONE" ? joinStep : closingStep;
  const isModalClosing = joinStep === "NONE" && closingStep !== "NONE";
  const isModalOpen = currentModalStep !== "NONE";

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, []);

  const openJoinFlow = async (index: number, roomId: number) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setPendingJoin({ index, roomId });
    setSelectedPosition(null);
    setSelectedChoiceNumber(null);
    setQuiz(null);
    setJoinErrorMessage(null);
    setClosingStep("NONE");
    setJoinStep("POSITION");
    setIsLoadingQuiz(true);

    try {
      const nextQuiz = await apiFetch<ChatQuiz>(`/chat-rooms/${roomId}/quiz`, {
        method: "GET",
      });
      setQuiz(nextQuiz);
    } catch (error) {
      setJoinErrorMessage((error as { message?: string })?.message ?? "퀴즈를 불러오지 못했어요.");
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const closeJoinFlow = () => {
    if (isEnteringLobby || joinStep === "NONE") return;

    setClosingStep(joinStep);
    setJoinStep("NONE");

    closeTimerRef.current = window.setTimeout(() => {
      setClosingStep("NONE");
      setPendingJoin(null);
      setSelectedPosition(null);
      setSelectedChoiceNumber(null);
      setQuiz(null);
      setJoinErrorMessage(null);
      closeTimerRef.current = null;
    }, MODAL_EXIT_MS);
  };

  const goToQuiz = async () => {
    if (!pendingJoin || !selectedPosition || isLoadingQuiz || !quiz) return;

    const agreeRemain = quiz.maxPerPosition - quiz.agreeCount;
    const disagreeRemain = quiz.maxPerPosition - quiz.disagreeCount;
    if (selectedPosition === "AGREE" && agreeRemain <= 0) return;
    if (selectedPosition === "DISAGREE" && disagreeRemain <= 0) return;

    setJoinErrorMessage(null);
    setSelectedChoiceNumber(null);
    setJoinStep("QUIZ");
  };

  const moveToLobby = async () => {
    if (!pendingJoin || !selectedPosition || !selectedChoiceNumber) return;
    setIsEnteringLobby(true);
    setJoinErrorMessage(null);

    try {
      const roomId = pendingJoin.roomId;
      const lobbyInfo = await apiFetch<ChatLobbyInfo>(`/chat-rooms/${roomId}/members`, {
        method: "POST",
        body: JSON.stringify({
          position: selectedPosition,
          quizAnswer: selectedChoiceNumber,
        }),
      });

      sessionStorage.setItem(`chatLobby:bootstrap:${roomId}`, JSON.stringify(lobbyInfo));
      onClickChat(pendingJoin.index, roomId);
      closeJoinFlow();
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code === "CHAT_ROOM_QUIZ_WRONG_ANSWER") {
        setJoinErrorMessage("퀴즈 정답이 아니에요. 다시 시도해주세요.");
      } else {
        setJoinErrorMessage(
          (error as { message?: string })?.message ?? "대기실 입장에 실패했어요.",
        );
      }
    } finally {
      setIsEnteringLobby(false);
    }
  };

  const agreeRemain = quiz ? Math.max(0, quiz.maxPerPosition - quiz.agreeCount) : null;
  const disagreeRemain = quiz ? Math.max(0, quiz.maxPerPosition - quiz.disagreeCount) : null;
  const isAgreeFull = agreeRemain !== null && agreeRemain <= 0;
  const isDisagreeFull = disagreeRemain !== null && disagreeRemain <= 0;

  return (
    <div className="relative mt-3 flex min-h-0 flex-1 flex-col gap-4 px-4 pb-8">
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

      {!showInitSkeleton && !isError && chats.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-10 text-sm text-gray-400">
          현재 진행 중인 토론방이 없습니다.
        </div>
      ) : null}

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
          onJoin={() => openJoinFlow(index, chat.roomId)}
        />
      ))}

      {showNextSkeleton
        ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={`next-${i}`} />)
        : null}

      <div ref={sentinelRef} />

      <ChatEnterModal
        isOpen={isModalOpen}
        isClosing={isModalClosing}
        currentStep={currentModalStep as "POSITION" | "QUIZ"}
        selectedPosition={selectedPosition}
        selectedChoiceNumber={selectedChoiceNumber}
        isAgreeFull={isAgreeFull}
        isDisagreeFull={isDisagreeFull}
        agreeRemain={agreeRemain}
        disagreeRemain={disagreeRemain}
        agreeCount={quiz?.agreeCount ?? null}
        disagreeCount={quiz?.disagreeCount ?? null}
        maxPerPosition={quiz?.maxPerPosition ?? null}
        isLoadingQuiz={isLoadingQuiz}
        isEnteringLobby={isEnteringLobby}
        canGoNext={
          !!selectedPosition &&
          !isLoadingQuiz &&
          !!quiz &&
          !(selectedPosition === "AGREE" && isAgreeFull) &&
          !(selectedPosition === "DISAGREE" && isDisagreeFull)
        }
        joinErrorMessage={joinErrorMessage}
        quiz={quiz}
        onClose={closeJoinFlow}
        onSelectPosition={setSelectedPosition}
        onNext={() => void goToQuiz()}
        onSelectChoice={setSelectedChoiceNumber}
        onPrev={() => setJoinStep("POSITION")}
        onComplete={() => void moveToLobby()}
      />
    </div>
  );
}
