"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/apiFetch";
import { uploadImageToS3 } from "@/lib/uploadImageToS3";
import { CreateMeetingFormValues } from "@/components/meeting/createMeetingSchema";
import { useMeetingCreateStore } from "@/stores/meetingCreateStore";

export default function MeetingCreateStep3() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { control, getValues, setValue } = useFormContext<CreateMeetingFormValues>();
  const queryClient = useQueryClient();
  const resetMeetingCreate = useMeetingCreateStore((state) => state.reset);
  const rounds = useWatch({ control, name: "rounds", defaultValue: [] });
  const booksByRound = useWatch({ control, name: "booksByRound", defaultValue: [] });

  const paramRound = useMemo(() => {
    const roundParam = searchParams.get("round");
    if (!roundParam) return null;
    const parsed = Number(roundParam);
    return Number.isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  useEffect(() => {
    if (!paramRound) return;
    const key = `meetingCreate:selectedBook:${paramRound}`;
    const stored = sessionStorage.getItem(key);
    if (!stored) return;
    try {
      const book = JSON.parse(stored);
      const nextBooks = booksByRound.map((item) =>
        item.roundNo === paramRound ? { ...item, book } : item,
      );
      setValue("booksByRound", nextBooks, { shouldDirty: true });
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn("[meetingCreate] sessionStorage parse failed", { key, error });
      sessionStorage.removeItem(key);
    }
  }, [booksByRound, paramRound, setValue]);

  const isValid = useMemo(() => booksByRound.every((b) => b.book), [booksByRound]);

  const handleSubmit = async () => {
    const values = getValues();
    let meetingImagePath = values.meetingImagePath;
    let meetingImageKey;
    const meetingImageFile = values.meetingImageFile as File | undefined;

    if (meetingImageFile) {
      const { key, publicUrl } = await uploadImageToS3({
        file: meetingImageFile,
        directory: "MEETING",
      });
      meetingImagePath = publicUrl;
      meetingImageKey = key;
    }

    const bookByRoundNo = new Map(values.booksByRound.map((b) => [b.roundNo, b.book]));

    const payload = {
      meetingImagePath: meetingImageKey,
      title: values.title,
      description: values.description,
      readingGenreId: values.readingGenreId,
      capacity: values.capacity,
      roundCount: values.roundCount,
      rounds: values.rounds.map((round) => {
        const book = bookByRoundNo.get(round.roundNo);
        console.log("book: ", book);
        return {
          ...round,
          book: book
            ? {
                isbn: book.isbn,
                title: book.title,
                authors: book.authors,
                publisher: book.publisher,
              }
            : null,
        };
      }),
      startTime: values.time.startTime,
      leaderIntro: values.leaderIntro ?? "",
      leaderIntroSavePolicy: values.leaderIntroSavePolicy ?? false,
      durationMinutes: 30,
      recruitmentDeadline: values.recruitmentDeadline,
    };

    console.log("test: ", payload);

    await apiFetch("/meetings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await queryClient.invalidateQueries({ queryKey: ["meetings"] });
    await queryClient.invalidateQueries({ queryKey: ["meetings", { size: 6 }] });
    await queryClient.invalidateQueries({ queryKey: ["my-meetings"] });
    resetMeetingCreate();
    router.push("/");
  };

  return (
    <div className="flex flex-1 flex-col space-y-8">
      <section className="space-y-4">
        <div className="flex flex-row gap-2">
          <label className="text-base font-semibold text-gray-900">모임 도서 선택</label>
          <p className="mt-1 text-xs text-gray-400">회차별 도서를 한 권씩 선택해주세요.</p>
        </div>
        <div className="space-y-3">
          {rounds.map((round) => {
            const selectedBook = booksByRound.find((b) => b.roundNo === round.roundNo)?.book;
            return (
              <button
                key={round.roundNo}
                type="button"
                onClick={() =>
                  router.push(`/book/search?returnTo=/meeting/create/book&round=${round.roundNo}`)
                }
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition hover:border-gray-300 ${
                  selectedBook ? "border-[var(--color-primary-purple)] border-1" : "border-gray-200"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {round.roundNo}회차 · {round.date || "날짜 미정"}
                  </p>
                  {selectedBook ? (
                    <>
                      <p className="mt-1 text-sm text-gray-800">{selectedBook.title}</p>
                      <p className="text-xs text-gray-500">{selectedBook.authors}</p>
                    </>
                  ) : (
                    <p className="mt-1 text-xs text-gray-400">모임 도서를 선택해주세요.</p>
                  )}
                </div>
                <span className="text-heading !font-[400] text-gray-400">›</span>
              </button>
            );
          })}
        </div>
      </section>

      <button
        type="button"
        disabled={!isValid}
        onClick={handleSubmit}
        className={`mt-auto w-full rounded-full py-4 text-sm font-semibold text-white ${
          isValid ? "bg-[var(--color-primary-purple)]" : "bg-gray-300"
        }`}
      >
        생성하기
      </button>
    </div>
  );
}
