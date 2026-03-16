"use client";

import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

type MeetingRatingFieldProps = {
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  errorMessage?: string;
};

export default function MeetingRatingField({
  title,
  description,
  value,
  onChange,
  errorMessage,
}: MeetingRatingFieldProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="text-xs text-gray-500">{description}</p>
      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const current = index + 1;
          return (
            <button
              key={`${title}-${current}`}
              type="button"
              aria-label={`${current}점`}
              onClick={() => onChange(current)}
              className="text-gray-500"
            >
              {current <= value ? (
                <StarIconSolid className="h-7 w-7 text-primary" />
              ) : (
                <StarIconOutline className="h-7 w-7" />
              )}
            </button>
          );
        })}
      </div>
      {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
    </section>
  );
}
