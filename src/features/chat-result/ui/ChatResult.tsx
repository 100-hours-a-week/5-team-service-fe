"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import postVote from "@/features/chat-result/api/post-vote";
import type { VoteChoice } from "@/features/chat-result/api/post-vote/types";
import getVoteResult from "@/features/chat-result/api/get-vote-result";
import type { VoteResultResponse } from "@/features/chat-result/api/get-vote-result/types";
import { RESULT_MAX_RETRY_COUNT, RESULT_RETRY_INTERVAL_MS, VOTING_SECONDS } from "../model/config";
import { formatSeconds } from "../lib/formatSeconds";
import ChatResultVoteSection from "./ChatResultVoteSection";
import ChatResultResultSection from "./ChatResultResultSection";
import getChatSummary from "@/features/chat-result/api/get-chat-summary";
import ChatSummary from "./ChatSummary";
import { GetChatSummaryResponse } from "../api/get-chat-summary/types";
import { consumeVoteExpiresAt } from "@/entities/chat/lib/chatVoteExpiresAtStore";

export default function ChatResult({ roomId }: { roomId: number }) {
  const router = useRouter();
  const [voteExpiresAtMs, setVoteExpiresAtMs] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(VOTING_SECONDS);

  useEffect(() => {
    const storedVoteExpiresAt = consumeVoteExpiresAt(roomId);
    if (!storedVoteExpiresAt) return;
    const parsed = new Date(storedVoteExpiresAt).getTime();
    if (Number.isNaN(parsed)) return;
    setVoteExpiresAtMs(parsed);
  }, [roomId]);
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [result, setResult] = useState<VoteResultResponse | null>(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [isResultFetchFinished, setIsResultFetchFinished] = useState(false);
  const [animatedAgreeCount, setAnimatedAgreeCount] = useState(0);
  const [animatedDisagreeCount, setAnimatedDisagreeCount] = useState(0);
  const [summary, setSummary] = useState<GetChatSummaryResponse | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    const calculateRemaining = () => {
      if (voteExpiresAtMs === null) return null;
      return Math.max(0, Math.floor((voteExpiresAtMs - Date.now()) / 1000));
    };

    if (voteExpiresAtMs !== null) {
      setRemainingSeconds(calculateRemaining() ?? 0);
    }

    const timer = window.setInterval(() => {
      const nextRemaining = calculateRemaining();
      setRemainingSeconds((prev) => {
        if (nextRemaining === null) {
          if (prev <= 1) {
            window.clearInterval(timer);
            return 0;
          }
          return prev - 1;
        }

        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return nextRemaining;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [voteExpiresAtMs]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingSummary(true);

    const fetchSummary = async () => {
      try {
        const nextSummary = await getChatSummary({ roomId });
        if (cancelled) return;
        setSummary(nextSummary);
      } catch {
        if (cancelled) return;
        setSummary(null);
      } finally {
        if (!cancelled) {
          setIsLoadingSummary(false);
        }
      }
    };

    void fetchSummary();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  useEffect(() => {
    if (remainingSeconds > 0 || result || isResultFetchFinished) return;

    let cancelled = false;
    let retryTimer: number | null = null;

    const fetchResultWithRetry = async (attempt: number) => {
      setIsLoadingResult(true);
      try {
        const next = await getVoteResult({ roomId });
        if (cancelled) return;
        setResult(next);
        setStatusMessage(null);
      } catch {
        if (cancelled) return;
        if (attempt >= RESULT_MAX_RETRY_COUNT) {
          setStatusMessage("투표 결과를 불러오지 못했습니다.");
          setIsResultFetchFinished(true);
          return;
        }

        setStatusMessage(
          `결과 집계 중입니다. 3초 후 다시 시도합니다. (${attempt}/${RESULT_MAX_RETRY_COUNT})`,
        );
        retryTimer = window.setTimeout(() => {
          void fetchResultWithRetry(attempt + 1);
        }, RESULT_RETRY_INTERVAL_MS);
      } finally {
        if (!cancelled) {
          setIsLoadingResult(false);
        }
      }
    };

    void fetchResultWithRetry(1);

    return () => {
      cancelled = true;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [isResultFetchFinished, remainingSeconds, result, roomId]);

  const canVote = remainingSeconds > 0 && !hasVoted;
  const displayResult = result;
  const shouldShowResult = remainingSeconds <= 0;

  const titleText = useMemo(() => {
    if (remainingSeconds > 0) return "최종 투표 진행 중";
    return "최종 투표 결과";
  }, [remainingSeconds]);
  const canFinishChat = shouldShowResult && (Boolean(result) || isResultFetchFinished);
  const resultSummary = useMemo(() => {
    if (!displayResult) return "";

    if (displayResult.agreeCount > displayResult.disagreeCount) {
      return `찬성 ${displayResult.agreeCount}표 · 반대 ${displayResult.disagreeCount}표로`;
    }

    return `반대 ${displayResult.disagreeCount}표 · 찬성 ${displayResult.agreeCount}표로`;
  }, [displayResult]);
  const resultWinner = useMemo(() => {
    if (!displayResult) return null;
    if (displayResult.agreeCount === displayResult.disagreeCount) return "DRAW" as const;
    return displayResult.agreeCount > displayResult.disagreeCount
      ? ("AGREE" as const)
      : ("DISAGREE" as const);
  }, [displayResult]);

  useEffect(() => {
    if (!shouldShowResult || !displayResult) return;

    setAnimatedAgreeCount(0);
    setAnimatedDisagreeCount(0);

    const timer = window.setInterval(() => {
      let done = true;

      setAnimatedAgreeCount((prev) => {
        if (prev < displayResult.agreeCount) {
          done = false;
          return prev + 1;
        }
        return prev;
      });

      setAnimatedDisagreeCount((prev) => {
        if (prev < displayResult.disagreeCount) {
          done = false;
          return prev + 1;
        }
        return prev;
      });

      if (done) {
        window.clearInterval(timer);
      }
    }, 120);

    return () => window.clearInterval(timer);
  }, [displayResult, shouldShowResult]);

  const handleVote = async () => {
    if (!canVote || !selectedChoice || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await postVote({ roomId, choice: selectedChoice });
      setHasVoted(true);
      if (remainingSeconds > 0) {
        setStatusMessage("투표가 완료되었습니다. 곧 결과가 공개됩니다.");
      }
    } catch (error) {
      setStatusMessage((error as { message?: string })?.message ?? "투표에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-6 py-8">
      <h1 className="text-subheading text-gray-900">토론 요약</h1>
      <ChatSummary isLoadingSummary={isLoadingSummary} summary={summary} />

      <h1 className="text-subheading text-gray-900 mt-10">{titleText}</h1>
      <p className="mt-2 text-body-2 text-gray-600">
        투표 종료까지 남은 시간: {formatSeconds(remainingSeconds)}
      </p>
      <ChatResultVoteSection
        selectedChoice={selectedChoice}
        canVote={canVote}
        shouldShowResult={shouldShowResult}
        animatedAgreeCount={animatedAgreeCount}
        animatedDisagreeCount={animatedDisagreeCount}
        remainingSeconds={remainingSeconds}
        isSubmitting={isSubmitting}
        onSelectChoice={setSelectedChoice}
        onSubmitVote={() => void handleVote()}
      />

      {statusMessage ? (
        <p className="mt-4 text-center text-body-2 text-gray-600">{statusMessage}</p>
      ) : null}

      <ChatResultResultSection
        shouldShowResult={shouldShowResult}
        isLoadingResult={isLoadingResult}
        displayResult={displayResult}
        resultSummary={resultSummary}
        resultWinner={resultWinner}
      />

      {canFinishChat ? (
        <button
          type="button"
          onClick={() => router.push("/chats")}
          className="mt-auto h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white"
        >
          채팅 토론 나가기
        </button>
      ) : null}
    </div>
  );
}
