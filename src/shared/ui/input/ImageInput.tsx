"use client";

import { Camera } from "lucide-react";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";

type ImageInputProps = {
  id?: string;
  label?: string;
  previewUrl?: string;
  errorMessage?: string;
  onPick: (file: File) => void;
};

export default function ImageInput({
  id,
  label,
  previewUrl,
  errorMessage,
  onPick,
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

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
    <div className="flex flex-col items-center gap-5">
      <Avatar className="relative size-30 overflow-visible">
        <div className="h-full w-full overflow-hidden rounded-full border border-2 border-gray-200 bg-gray-200 text-gray-500">
          <AvatarImage src={previewUrl ?? ""} alt={label} className="h-full w-full object-cover" />
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
