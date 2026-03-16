"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ReviewImageViewerProps = {
  isOpen: boolean;
  isClosing: boolean;
  imageUrls: string[];
  initialIndex: number;
  onClose: () => void;
};

function clampIndex(index: number, length: number) {
  if (!length) return 0;
  if (index < 0) return 0;
  if (index > length - 1) return length - 1;
  return index;
}

export default function ReviewImageViewer({
  isOpen,
  isClosing,
  imageUrls,
  initialIndex,
  onClose,
}: ReviewImageViewerProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(() =>
    clampIndex(initialIndex, imageUrls.length),
  );

  const resolvedIndex = useMemo(
    () => clampIndex(currentIndex, imageUrls.length),
    [currentIndex, imageUrls.length],
  );
  const shouldRender = isOpen || isClosing;
  const isVisible = isOpen && !isClosing;

  useEffect(() => {
    if (!isOpen || isClosing) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const moveToCurrent = () => {
      const width = scroller.clientWidth;
      scroller.scrollTo({ left: width * resolvedIndex, behavior: "auto" });
    };

    requestAnimationFrame(moveToCurrent);
  }, [isOpen, isClosing, resolvedIndex]);

  useEffect(() => {
    if (!isOpen || isClosing) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => clampIndex(prev - 1, imageUrls.length));
      }
      if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => clampIndex(prev + 1, imageUrls.length));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isClosing, imageUrls.length, onClose]);

  useEffect(() => {
    if (!shouldRender) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender || !imageUrls.length) return null;

  return (
    <div
      className={`fixed inset-y-0 left-1/2 z-[70] flex w-full max-w-[500px] -translate-x-1/2 flex-col bg-black/90 transition-opacity duration-200 ${
        isVisible ? "animate-fade-in opacity-100" : "animate-fade-out opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative z-10 flex h-16 items-center px-4 pt-[env(safe-area-inset-top)] text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/90"
          aria-label="이미지 뷰어 닫기"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 text-body-emphasis tabular-nums">
          {resolvedIndex + 1} / {imageUrls.length}
        </p>
      </div>

      <div
        ref={scrollerRef}
        className={`no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden transition-transform duration-200 ${
          isVisible ? "scale-100" : "scale-[0.985]"
        }`}
        onScroll={(event) => {
          const target = event.currentTarget;
          const width = target.clientWidth;
          if (!width) return;
          const nextIndex = clampIndex(Math.round(target.scrollLeft / width), imageUrls.length);
          if (nextIndex !== resolvedIndex) {
            setCurrentIndex(nextIndex);
          }
        }}
      >
        {imageUrls.map((imageUrl, index) => (
          <div
            key={`${imageUrl}-${index}`}
            className="flex h-full w-full shrink-0 snap-center items-center justify-center"
            onClick={onClose}
          >
            <div className="relative h-full w-full" onClick={(event) => event.stopPropagation()}>
              <Image
                src={imageUrl}
                alt={`후기 이미지 원본 ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority={index === resolvedIndex}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
