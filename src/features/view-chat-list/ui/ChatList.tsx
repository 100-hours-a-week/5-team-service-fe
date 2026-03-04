"use client";

import { useEffect, useRef, useState } from "react";
import useChats from "../model/useChats";
import ChatCard from "./ChatCard";
import { Skeleton } from "./Skeleton";
import { apiFetch } from "@/lib/api/apiFetch";
import type { ChatLobbyInfo } from "@/features/chat-lobby/model/types";

type JoinPosition = "AGREE" | "DISAGREE";
type JoinStep = "NONE" | "POSITION" | "QUIZ";
type ChatQuiz = {
  question: string;
  choices: { choiceNumber: number; choiceText: string }[];
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

  const openJoinFlow = (index: number, roomId: number) => {
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
    if (!pendingJoin || !selectedPosition || isLoadingQuiz) return;
    setIsLoadingQuiz(true);
    setJoinErrorMessage(null);

    try {
      const nextQuiz = await apiFetch<ChatQuiz>(`/chat-rooms/${pendingJoin.roomId}/quiz`, {
        method: "GET",
      });
      setQuiz(nextQuiz);
      setSelectedChoiceNumber(null);
      setJoinStep("QUIZ");
    } catch (error) {
      setJoinErrorMessage((error as { message?: string })?.message ?? "퀴즈를 불러오지 못했어요.");
    } finally {
      setIsLoadingQuiz(false);
    }
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

      {isModalOpen ? (
        <div
          className={`fixed bottom-16 left-1/2 top-0 z-40 flex w-full max-w-[500px] -translate-x-1/2 items-end justify-center bg-black/30 p-4 ${
            isModalClosing ? "animate-fade-out" : "animate-fade-in"
          }`}
        >
          {currentModalStep === "POSITION" ? (
            <div
              className={`w-full rounded-2xl bg-white p-5 ${
                isModalClosing ? "animate-sheet-down" : "animate-sheet-up"
              }`}
            >
              <p className="text-base font-semibold text-gray-900">입장 포지션을 선택해주세요</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPosition("AGREE")}
                  className={`h-11 rounded-xl border text-sm font-semibold ${
                    selectedPosition === "AGREE"
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  찬성
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPosition("DISAGREE")}
                  className={`h-11 rounded-xl border text-sm font-semibold ${
                    selectedPosition === "DISAGREE"
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  반대
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeJoinFlow}
                  disabled={isEnteringLobby}
                  className="h-11 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={!selectedPosition || isLoadingQuiz}
                  onClick={() => void goToQuiz()}
                  className="h-11 rounded-xl bg-primary-purple text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isLoadingQuiz ? "불러오는 중..." : "다음"}
                </button>
              </div>
              {joinErrorMessage ? (
                <p className="mt-3 text-sm text-red-500">{joinErrorMessage}</p>
              ) : null}
            </div>
          ) : null}

          {currentModalStep === "QUIZ" ? (
            <div
              className={`w-full rounded-2xl bg-white p-5 ${
                isModalClosing ? "animate-sheet-down" : "animate-sheet-up"
              }`}
            >
              <p className="text-base font-semibold text-gray-900">
                {quiz?.question ?? "입장 퀴즈를 불러오지 못했어요."}
              </p>
              <div className="mt-4 space-y-2">
                {(quiz?.choices ?? []).map((choice) => (
                  <button
                    key={choice.choiceNumber}
                    type="button"
                    onClick={() => setSelectedChoiceNumber(choice.choiceNumber)}
                    className={`w-full rounded-xl border px-3 py-3 text-left text-sm ${
                      selectedChoiceNumber === choice.choiceNumber
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {choice.choiceNumber}. {choice.choiceText}
                  </button>
                ))}
              </div>
              {joinErrorMessage ? (
                <p className="mt-3 text-sm text-red-500">{joinErrorMessage}</p>
              ) : null}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setJoinStep("POSITION")}
                  disabled={isEnteringLobby}
                  className="h-11 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700"
                >
                  이전
                </button>
                <button
                  type="button"
                  disabled={!selectedChoiceNumber || isEnteringLobby || !quiz}
                  onClick={() => void moveToLobby()}
                  className="h-11 rounded-xl bg-primary-purple text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isEnteringLobby ? "입장 중..." : "완료"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
