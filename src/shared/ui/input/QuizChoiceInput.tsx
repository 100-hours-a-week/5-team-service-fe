"use client";

import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type QuizChoiceInputProps = {
  choiceNumber: number;
  checked: boolean;
  onSelectCorrect: (choiceNumber: number) => void;
  placeholder?: string;
  errorMessage?: string;
  hiddenInputProps?: InputHTMLAttributes<HTMLInputElement>;
  textInputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export default function QuizChoiceInput({
  choiceNumber,
  checked,
  onSelectCorrect,
  placeholder,
  errorMessage,
  hiddenInputProps,
  textInputProps,
}: QuizChoiceInputProps) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-3 py-2">
        <button
          type="button"
          aria-label={`${choiceNumber}번 선지를 정답으로 선택`}
          onClick={() => onSelectCorrect(choiceNumber)}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            checked ? "border-primary-purple" : "border-gray-400",
          )}
        >
          {checked ? <span className="h-2 w-2 rounded-full bg-primary-purple" /> : null}
        </button>

        <input type="hidden" {...hiddenInputProps} value={choiceNumber} readOnly />

        <input
          {...textInputProps}
          placeholder={placeholder ?? `선택지 ${choiceNumber}`}
          aria-label={`선택지 ${choiceNumber}`}
          className="w-full bg-transparent text-label text-gray-900 py-2 text-gray-900 outline-none border-b border-gray-200 placeholder:text-gray-400"
        />
      </div>
      <p className="text-caption !font-[500] text-red-500">{errorMessage ? errorMessage : ""}</p>
    </div>
  );
}
