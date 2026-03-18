import { useRef, useState } from "react";
import pokeBookReport from "../api/poke-book-report";

const POKE_ERROR_MESSAGE = "콕 찌르기 알림을 보내지 못했어요.";
const POKE_THROTTLE_MS = 3000;

const resolvePokeErrorMessage = (error: unknown, fallback: string) =>
  (error as { message?: string })?.message ?? fallback;

export default function usePokeMember(roundId: number) {
  const [pokingMemberIds, setPokingMemberIds] = useState<number[]>([]);
  const [isPokingAll, setIsPokingAll] = useState(false);
  const [pokeErrorMessage, setPokeErrorMessage] = useState<string | null>(null);
  const lastPokedAtRef = useRef<Record<number, number>>({});

  const clearPokeError = () => {
    setPokeErrorMessage(null);
  };

  const pokeMember = async (meetingMemberId: number) => {
    const now = Date.now();
    const lastPokedAt = lastPokedAtRef.current[meetingMemberId] ?? 0;

    if (pokingMemberIds.includes(meetingMemberId) || now - lastPokedAt < POKE_THROTTLE_MS) {
      return false;
    }

    lastPokedAtRef.current[meetingMemberId] = now;
    setPokeErrorMessage(null);
    setPokingMemberIds((prev) =>
      prev.includes(meetingMemberId) ? prev : [...prev, meetingMemberId],
    );

    try {
      await pokeBookReport({ roundId, meetingMemberId });
    } catch (error) {
      setPokeErrorMessage(resolvePokeErrorMessage(error, POKE_ERROR_MESSAGE));
    } finally {
      setPokingMemberIds((prev) => prev.filter((id) => id !== meetingMemberId));
    }

    return true;
  };

  const pokeAllMembers = async (meetingMemberIds: number[]) => {
    const now = Date.now();

    if (meetingMemberIds.length === 0) {
      return [];
    }

    const eligibleMemberIds = meetingMemberIds.filter((meetingMemberId) => {
      const lastPokedAt = lastPokedAtRef.current[meetingMemberId] ?? 0;
      return !pokingMemberIds.includes(meetingMemberId) && now - lastPokedAt >= POKE_THROTTLE_MS;
    });

    if (eligibleMemberIds.length === 0) return [];

    eligibleMemberIds.forEach((meetingMemberId) => {
      lastPokedAtRef.current[meetingMemberId] = now;
    });
    setPokeErrorMessage(null);
    setIsPokingAll(true);
    setPokingMemberIds((prev) => Array.from(new Set([...prev, ...eligibleMemberIds])));

    try {
      const results = await Promise.allSettled(
        eligibleMemberIds.map((meetingMemberId) => pokeBookReport({ roundId, meetingMemberId })),
      );
      const rejectedCount = results.filter((result) => result.status === "rejected").length;

      if (rejectedCount > 0) {
        const rejectedResult = results.find(
          (result): result is PromiseRejectedResult => result.status === "rejected",
        );
        setPokeErrorMessage(
          rejectedCount === meetingMemberIds.length
            ? resolvePokeErrorMessage(rejectedResult?.reason, POKE_ERROR_MESSAGE)
            : `${rejectedCount}명에게 콕 찌르기 알림을 보내지 못했어요.`,
        );
      }
    } finally {
      setPokingMemberIds((prev) => prev.filter((id) => !eligibleMemberIds.includes(id)));
      setIsPokingAll(false);
    }

    return eligibleMemberIds;
  };

  return {
    pokeMember,
    pokeAllMembers,
    pokingMemberIds,
    isPokingAll,
    pokeErrorMessage,
    clearPokeError,
  };
}
