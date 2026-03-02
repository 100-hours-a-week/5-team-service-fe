"use client";

import { Controller, FieldErrors, useFormContext } from "react-hook-form";
import { getNameByPath } from "@/shared/lib/getNameByPath";
import NumberStepper from "@/shared/ui/input/NumberStepper";
import InputFieldFrame from "./InputFieldFrame";

type NumberStepperFieldProps = {
  name: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  helperText?: string;
  className?: string;
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function NumberStepperField({
  name,
  label,
  unit,
  min,
  max,
  step = 1,
  helperText,
  className,
}: NumberStepperFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const id = makeId(name);
  const errorObj = getNameByPath<{ message?: unknown }>(errors as FieldErrors, name);
  const errorMessage = typeof errorObj?.message === "string" ? errorObj.message : "";

  return (
    <InputFieldFrame id={id} label={label} helperText={helperText} errorMessage={errorMessage}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NumberStepper
            value={Number.isFinite(field.value) ? field.value : min}
            unit={unit}
            min={min}
            max={max}
            step={step}
            className={className}
            onChange={field.onChange}
          />
        )}
      />
    </InputFieldFrame>
  );
}
