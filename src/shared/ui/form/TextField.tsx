"use client";

import { FieldErrors, useFormContext } from "react-hook-form";
import TextInput from "../input/TextInput";
import InputFieldFrame from "./InputFieldFrame";
import { getNameByPath } from "@/shared/lib/getNameByPath";

type TextFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
  isFixed?: boolean;
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function TextField({
  name,
  label,
  placeholder,
  helperText,
  maxLength,
  isFixed = true,
}: TextFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const id = makeId(name);
  const errorObj = getNameByPath<{ message?: unknown }>(errors as FieldErrors, name);
  const errorMessage = typeof errorObj?.message === "string" ? errorObj.message : "";

  return (
    <InputFieldFrame
      id={id}
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      isFixed={isFixed}
    >
      <TextInput
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        inputProps={register(name)}
      />
    </InputFieldFrame>
  );
}
