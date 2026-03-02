"use client";

import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import ImageInput from "../input/ImageInput";
import { getNameByPath } from "@/shared/lib/getNameByPath";

type ImageFieldProps = {
  urlName: string;
  fileName: string;
  label: string;
  helperText?: string;
  variant?: "circle" | "rect";
};

const makeId = (name: string) => `field_${name.replace(/[.\[\]]/g, "_")}`;

export default function ImageField({
  urlName,
  fileName,
  label,
  variant = "circle",
}: ImageFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const imagePath = (watch(urlName) as string | undefined) ?? "";
  const imageFile = (watch(fileName) as File | null | undefined) ?? null;

  const id = makeId(fileName);
  const directError = getNameByPath<{ message?: unknown }>(errors, fileName);
  const errorMessage = typeof directError?.message === "string" ? directError.message : "";

  const objectUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);
  const previewUrl = objectUrl ?? imagePath;

  const handlePick = (file: File) => {
    setValue(fileName, file, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <ImageInput
      id={id}
      label={label}
      previewUrl={previewUrl}
      errorMessage={errorMessage}
      onPick={handlePick}
      variant={variant}
    />
  );
}
