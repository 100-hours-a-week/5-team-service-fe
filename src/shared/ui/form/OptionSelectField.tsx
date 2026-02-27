"use client";

import { FieldErrors, useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";
import { getNameByPath } from "@/shared/lib/getNameByPath";
import InputFieldFrame from "./InputFieldFrame";
import IconOptionSelectInput from "../input/OptionSelectInput";
import { Option } from "../input/OptionSelectInput";

type OptionSelectFieldProps = {
  name: string;
  label: string;
  helperText?: string;
  options: Option[];
  onChange?: (next: string | number) => void;
  columns: number;
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function OptionSelectField({
  name,
  label,
  helperText,
  options,
  onChange,
  columns,
}: OptionSelectFieldProps) {
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
          <IconOptionSelectInput
            id={id}
            name={field.name}
            value={field.value}
            options={options}
            onChange={(next) => {
              field.onChange(next);
              onChange?.(next);
            }}
            columns={columns}
          />
        )}
      />
    </InputFieldFrame>
  );
}
