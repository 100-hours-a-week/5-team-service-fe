"use client";

import { getNameByPath } from "@/shared/lib/getNameByPath";
import { Controller, FieldErrors, useFormContext } from "react-hook-form";
import InputFieldFrame from "./InputFieldFrame";
import { useEffect } from "react";
import { useCreateChatStore } from "@/features/create-chat/model/store";
import BookSelectInput from "../input/BookInput";

type BookSelectFieldProps = {
  name: string;
  label: string;
  helperText?: string;
  returnTo: string;
  emptyText: string;
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function BookSelectField({
  name,
  label,
  helperText,
  returnTo,
  emptyText,
}: BookSelectFieldProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const selectedBook = useCreateChatStore((state) => state.selectedBook);

  useEffect(() => {
    if (!selectedBook?.isbn) return;
    setValue(name, selectedBook.isbn, { shouldDirty: true, shouldValidate: true });
  }, [name, selectedBook?.isbn, setValue]);

  const id = makeId(name);
  const errorObj = getNameByPath<{ message?: unknown }>(errors as FieldErrors, name);
  const errorMessage = typeof errorObj?.message === "string" ? errorObj.message : "";

  return (
    <InputFieldFrame id={id} label={label} helperText={helperText} errorMessage={errorMessage}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <BookSelectInput
            id={id}
            value={field.value}
            selectedBook={selectedBook}
            returnTo={returnTo}
            emptyText={emptyText}
          />
        )}
      />
    </InputFieldFrame>
  );
}
