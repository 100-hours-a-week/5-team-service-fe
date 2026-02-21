"use client";

import { InputHTMLAttributes, useMemo, useState } from "react";

type TextAreaInputProps = {
  id: string;
  name?: string;
  placeholder?: string;
  maxLength?: number;
  inputProps?: InputHTMLAttributes<HTMLTextAreaElement>;
};

export default function TextAreaInput({
  id,
  name,
  placeholder,
  maxLength,
  inputProps,
}: TextAreaInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const controlledValue = inputProps?.value;
  const currentLength = useMemo(() => {
    if (typeof controlledValue === "string" || typeof controlledValue === "number") {
      return String(controlledValue).length;
    }
    return internalValue.length;
  }, [controlledValue, internalValue.length]);

  return (
    <div className="relative overflow-visible">
      <textarea
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-label={`${name} 입력`}
        className="no-scrollbar min-h-[120px] w-full resize-none !leading-6 rounded-lg border border-1 border-gray-200 bg-white px-4 py-3 text-label !font-[400] text-gray-900 outline-none transition-colors duration-200 focus:border-primary-purple"
        {...inputProps}
        onChange={(event) => {
          setInternalValue(event.currentTarget.value);
          inputProps?.onChange?.(event);
        }}
      />
      <span className="pointer-events-none absolute -top-7 right-3 text-[11px] text-gray-500">
        {currentLength}
        {typeof maxLength === "number" ? ` / ${maxLength}` : null}
      </span>
    </div>
  );
}
