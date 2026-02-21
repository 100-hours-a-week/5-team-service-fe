import { InputHTMLAttributes } from "react";

type TextInputProps = {
  id: string;
  name?: string;
  placeholder?: string;
  maxLength?: number;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export default function TextInput({
  id,
  name,
  placeholder,
  maxLength,
  inputProps,
}: TextInputProps) {
  return (
    <input
      id={id}
      placeholder={placeholder}
      maxLength={maxLength}
      aria-label={`${name} 입력`}
      className="w-full rounded-lg bg-white px-4 py-4 text-label !font-[400] text-gray-900 outline-none transition-colors duration-200 border border-1 border-gray-200 focus:border-primary-purple"
      {...inputProps}
    />
  );
}
