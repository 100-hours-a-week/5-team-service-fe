"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import KakaoLoginButton from "@/components/login/KakaoLoginButton";

export default function Page() {
  const slides = useMemo(
    () => [
      {
        id: 1,
        image: "/chracter_book.png",
        title: "정해진 일정에 맞춰 함께 읽어요",
        description:
          "읽고 싶은 책으로 모임에 참여해요.\n토론 전까지 함께 읽으며 자연스럽게 루틴을 만들어요.",
      },
      {
        id: 2,
        image: "/chracter_alone.png",
        title: "나에게 맞는 모임을 AI가 추천해요",
        description: "나의 관심사와 행동을 기반으로\nAI가 맞춤형 독서 모임을 추천해줘요.",
      },
      {
        id: 3,
        image: "/chracter.png",
        title: "온라인에서 부담 없이 토론해요",
        description:
          "시간과 공간의 제약 없이\n원하는 시간에, 원하는 장소에서 책에 대해 이야기해요.",
      },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-10 text-center">
      <h2 className="text-lg font-bold text-gray-900">DOKTORI</h2>
      <div key={slides[activeIndex].id} className="mt-10 px-8 py-10 animate-fade-in-up">
        <div className="mx-auto flex h-72 w-full items-center justify-center">
          <Image
            src={slides[activeIndex].image}
            alt={slides[activeIndex].title}
            width={720}
            height={720}
            className="h-auto w-[280px] object-contain"
            priority={slides[activeIndex].id === 1}
          />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">{slides[activeIndex].title}</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {slides[activeIndex].description}
        </p>

        <div className="mt-30 flex items-center justify-center gap-2">
          {slides.map((dot, index) => (
            <span
              key={dot.id}
              className={`h-2 w-2 rounded-full ${
                index === activeIndex ? "bg-primary-purple" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-8 px-10 w-full">
        <KakaoLoginButton />
      </div>
    </div>
  );
}
