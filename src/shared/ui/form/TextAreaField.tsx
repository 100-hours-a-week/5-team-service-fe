"use client";

import { FieldErrors, useFormContext } from "react-hook-form";
import InputFieldFrame from "./InputFieldFrame";
import { getNameByPath } from "@/shared/lib/getNameByPath";
import TextAreaInput from "../input/TextAreaInput";

type TextAreaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function TextAreaField({
  name,
  label,
  placeholder,
  helperText,
  maxLength,
}: TextAreaFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const id = makeId(name);
  const errorObj = getNameByPath<{ message?: unknown }>(errors as FieldErrors, name);
  const errorMessage = typeof errorObj?.message === "string" ? errorObj.message : "";

  return (
    <InputFieldFrame id={id} label={label} helperText={helperText} errorMessage={errorMessage}>
      <TextAreaInput
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        inputProps={register(name)}
      />
    </InputFieldFrame>
  );
}
