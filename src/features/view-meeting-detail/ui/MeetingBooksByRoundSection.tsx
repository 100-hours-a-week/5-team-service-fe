"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GetMeetingDetailResponse } from "../model/types";

type MeetingBooksByRoundSectionProps = {
  sectionRef: (element: HTMLDivElement | null) => void;
  rounds: GetMeetingDetailResponse["rounds"];
};

export default function MeetingBooksByRoundSection({
  sectionRef,
  rounds,
}: MeetingBooksByRoundSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActiveIndex = () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (!cards.length) return;

      const trackCenterX = track.scrollLeft + track.clientWidth / 2;
      let nextIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenterX - trackCenterX);
        if (distance < minDistance) {
          minDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex(nextIndex);
    };

    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    updateActiveIndex();

    return () => {
      track.removeEventListener("scroll", updateActiveIndex);
    };
  }, [rounds]);

  const handleClickIndicator = (index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;

    const targetLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  if (!rounds?.length) {
    return (
      <section ref={sectionRef} data-tab="books" className="scroll-mt-16 px-5 py-5">
        <h2 className="text-[18px] !font-[600] text-gray-900">모임 도서를 소개합니다.</h2>
        <p className="mt-3 text-sm text-gray-500">등록된 도서가 아직 없어요.</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-tab="books"
      className="scroll-mt-16 py-5 pb-10 border-b-2 border-gray-100 "
    >
      <h2 className="px-5 text-[18px] !font-[600] text-gray-900">우리 모임은 이런 책을 읽어요.</h2>

      <div
        ref={trackRef}
        className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 py-3 [scroll-padding-inline:20px]"
      >
        {rounds.map((round, index) => (
          <article
            key={round.roundNo}
            data-round-card="true"
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="h-[220px] min-w-[75%] snap-start rounded-3xl border border-gray-purple bg-white px-5 py-7 shadow-[0_4px_10px_rgba(15,23,42,0.06)]"
          >
            <div className="flex h-full items-center gap-6">
              <div className="relative h-full w-[35%] shrink-0 drop-shadow-[0_4px_8px_rgba(15,23,42,0.12)]">
                {round.book.thumbnailUrl ? (
                  <Image
                    src={round.book.thumbnailUrl}
                    alt={`${round.book.title} 표지`}
                    fill
                    sizes="(max-width: 500px) 32vw, 140px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="flex h-full min-w-0 flex-1 flex-col">
                <span className="self-start rounded-2xl border border-primary  px-3 py-1 text-caption !font-[600] text-primary">
                  {round.roundNo}회차
                </span>
                <h3 className="mt-3 line-clamp-2 text-body-emphasis leading-tight text-gray-900">
                  {round.book.title}
                </h3>

                <div className="mt-auto space-y-2">
                  <p className="truncate text-label text-gray-500">저자 | {round.book.authors}</p>
                  <p className="truncate text-label text-gray-500">
                    출판사 | {round.book.publisher}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {rounds.map((_, index) => (
          <button
            type="button"
            key={`round-dot-${index}`}
            aria-label={`${index + 1}회차 카드로 이동`}
            onClick={() => handleClickIndicator(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-primary" : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
