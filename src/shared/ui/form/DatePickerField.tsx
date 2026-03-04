"use client";

import { Controller, FieldErrors, useFormContext } from "react-hook-form";
import { getNameByPath } from "@/shared/lib/getNameByPath";
import DatePickerInput from "@/shared/ui/input/DatePickerInput";
import InputFieldFrame from "./InputFieldFrame";

type DatePickerFieldProps = {
  name: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function DatePickerField({
  name,
  label,
  helperText,
  placeholder,
  minDate,
  maxDate,
}: DatePickerFieldProps) {
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
          <DatePickerInput
            id={id}
            value={typeof field.value === "string" ? field.value : ""}
            placeholder={placeholder}
            minDate={minDate}
            maxDate={maxDate}
            onChange={field.onChange}
          />
        )}
      />
    </InputFieldFrame>
  );
}
