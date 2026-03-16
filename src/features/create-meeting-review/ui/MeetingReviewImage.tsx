"use client";

import { useRef, type ChangeEventHandler } from "react";
import Image from "next/image";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";

type MeetingReviewImageProps = {
  images: File[];
  imagePreviewUrls: string[];
  onAppendImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  errorMessage?: string;
  maxCount?: number;
};

export default function MeetingReviewImage({
  images,
  imagePreviewUrls,
  onAppendImages,
  onRemoveImage,
  errorMessage,
  maxCount = 5,
}: MeetingReviewImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectImages: ChangeEventHandler<HTMLInputElement> = (event) => {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length > 0) {
      onAppendImages(selected);
    }
    event.currentTarget.value = "";
  };

  return (
    <section className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleSelectImages}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex w-full items-center justify-center rounded-2xl border border-gray-300 bg-white px-6 py-3 text-gray-900"
      >
        <CameraIcon className="h-5 w-5" />
        <span className="ml-3 text-label">사진 첨부하기</span>
      </button>

      {images.length > 0 ? (
        <p className="text-xs text-gray-500">
          최대 {maxCount}장까지 업로드할 수 있어요. ({images.length}/{maxCount})
        </p>
      ) : null}

      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        {imagePreviewUrls.map((previewUrl, index) => (
          <div
            key={`${previewUrl}-${index}`}
            className="relative h-[124px] w-[124px] shrink-0 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100"
          >
            <Image
              src={previewUrl}
              alt={`리뷰 이미지 ${index + 1}`}
              fill
              sizes="124px"
              className="object-cover"
            />
            <button
              type="button"
              aria-label="이미지 삭제"
              onClick={() => onRemoveImage(index)}
              className="absolute right-2 top-2 rounded-full border-2 border-white bg-black/80 p-1 text-white"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
    </section>
  );
}
