"use client";

import { Controller, FieldErrors, useFormContext } from "react-hook-form";
import { getNameByPath } from "@/shared/lib/getNameByPath";
import InputFieldFrame from "./InputFieldFrame";
import DropdownInput, { DropdownOption } from "../input/DropdownInput";

type DropdownFieldProps = {
  name: string;
  label: string;
  helperText?: string;
  placeholder?: string;
  options: DropdownOption[];
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function DropdownField({
  name,
  label,
  helperText,
  placeholder,
  options,
}: DropdownFieldProps) {
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
          <DropdownInput
            id={id}
            value={field.value}
            options={options}
            placeholder={placeholder}
            onChange={field.onChange}
          />
        )}
      />
    </InputFieldFrame>
  );
}
