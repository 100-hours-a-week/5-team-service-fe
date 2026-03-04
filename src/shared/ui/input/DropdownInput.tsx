"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export type DropdownOption = {
  value: string | number;
  label: string;
};

type DropdownInputProps = {
  id: string;
  value: string | number | null | undefined;
  options: DropdownOption[];
  placeholder?: string;
  onChange: (value: string | number) => void;
};

export default function DropdownInput({
  id,
  value,
  options,
  placeholder = "탭하여 선택하기",
  onChange,
}: DropdownInputProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!containerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-lg border px-4 py-4 text-left text-label !font-[400] ${
          open ? "border-primary" : "border-gray-200"
        }`}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 rounded-lg border border-primary/30 bg-white p-2 shadow-lg">
          <div className="no-scrollbar max-h-60 overflow-y-auto">
            {options.map((option) => {
              const checked = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`mb-1 flex w-full rounded-xl px-4 py-3 text-left text-label  !font-[400] transition-colors last:mb-0 ${
                    checked
                      ? "bg-primary/10 text-primary !font-[500]"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
