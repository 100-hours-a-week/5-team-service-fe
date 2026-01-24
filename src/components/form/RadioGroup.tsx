"use client";

import { Controller, useFormContext } from "react-hook-form";

import type { PolicyOption } from "@/components/onboarding/model/stepInfo";
import type { OnboardingFormValues } from "@/components/onboarding/types";

type RadioGroupProps = {
  name: keyof OnboardingFormValues;
  options: PolicyOption[];
  variant?: "default" | "dot";
};

export default function RadioGroup({ name, options, variant = "default" }: RadioGroupProps) {
  const { control } = useFormContext<OnboardingFormValues>();
  const isDot = variant === "dot";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={
            isDot ? "flex flex-col gap-4" : "flex flex-wrap items-center justify-center gap-3"
          }
        >
          {options.map((option) => {
            const checked = field.value === option.id;

            return (
              <label
                key={option.id}
                className={
                  isDot
                    ? "flex cursor-pointer items-center gap-3 text-body-1 !font-[600] text-gray-900"
                    : `cursor-pointer rounded-full border px-5 py-3 text-body-1 !font-[600] transition ${
                        checked
                          ? "border-transparent bg-[#5B5DEB] text-white shadow-[0_6px_16px_rgba(91,93,235,0.35)]"
                          : "border-gray-300 bg-white text-gray-900"
                      }`
                }
              >
                <input
                  className="sr-only"
                  type="radio"
                  name={field.name}
                  value={option.id}
                  checked={checked}
                  onChange={() => field.onChange(option.id)}
                />
                {isDot ? (
                  <>
                    <span
                      className={`flex size-6 items-center justify-center rounded-full border-2 ${
                        checked ? "border-[#5B5DEB]" : "border-gray-300"
                      }`}
                    >
                      {checked ? <span className="block size-3 rounded-full bg-[#5B5DEB]" /> : null}
                    </span>
                    <span>{option.name}</span>
                  </>
                ) : (
                  <span>{option.name}</span>
                )}
              </label>
            );
          })}
        </div>
      )}
    />
  );
}
