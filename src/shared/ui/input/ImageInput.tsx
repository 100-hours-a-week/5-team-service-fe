"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";

type ImageInputVariant = "circle" | "rect";

type ImageInputProps = {
  id?: string;
  label?: string;
  previewUrl?: string;
  errorMessage?: string;
  onPick: (file: File) => void;
  variant?: ImageInputVariant;
};

export default function ImageInput({
  id,
  label,
  previewUrl,
  errorMessage,
  onPick,
  variant = "circle",
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const isLoadFailed = Boolean(previewUrl && failedUrl === previewUrl);

  const handleSelect = () => {
    inputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file) {
      return;
    }
    onPick(file);
  };

  return (
    <div
      className={`flex flex-col gap-5 ${variant === "circle" ? "items-center" : "items-stretch"}`}
    >
      {variant === "circle" ? (
        <Avatar className="relative size-30 overflow-visible">
          <div className="h-full w-full overflow-hidden rounded-full border border-2 border-gray-200 bg-gray-200 text-gray-500">
            {previewUrl && !isLoadFailed ? (
              <AvatarImage
                src={previewUrl}
                alt={label}
                className="h-full w-full object-cover"
                onError={() => setFailedUrl(previewUrl)}
              />
            ) : null}
            <AvatarFallback>이미지</AvatarFallback>
          </div>
          <button
            type="button"
            onClick={handleSelect}
            className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary-purple text-white shadow-md ring-2 ring-white"
            aria-label="이미지 업로드"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
          </button>
        </Avatar>
      ) : (
        <div className="relative w-full">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border-1 border-gray-200 bg-gray-200">
            {previewUrl && !isLoadFailed ? (
              <img
                src={previewUrl}
                alt={label}
                className="h-full w-full object-cover"
                onError={() => setFailedUrl(previewUrl)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                이미지
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSelect}
            className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-primary-purple text-white shadow-md ring-2 ring-white"
            aria-label="이미지 업로드"
          >
            <Camera className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="h-2">
        <p className="text-caption !font-[500] text-red-500">{errorMessage ? errorMessage : ""}</p>
      </div>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
