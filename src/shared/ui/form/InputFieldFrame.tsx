import { ReactNode } from "react";

type InputFieldFrameProps = {
  id: string;
  label: string;
  helperText?: string;
  errorMessage?: string;
  isFixed?: boolean;
  children: ReactNode;
};

export default function InputFieldFrame({
  id,
  label,
  helperText,
  errorMessage,
  isFixed = true,
  children,
}: InputFieldFrameProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-2">
        <label htmlFor={id} className="text-base font-semibold text-gray-900">
          {label}
        </label>
        {helperText ? <p className="mt-1 text-xs text-gray-400">{helperText}</p> : null}
      </div>
      {children}
      {isFixed ? (
        <div className="h-2">
          <p className="text-caption !font-[500] text-red-500">
            {errorMessage ? errorMessage : ""}
          </p>
        </div>
      ) : (
        <p className="mt-1 mb-3 text-caption !font-[500] text-red-500">
          {errorMessage ? errorMessage : ""}
        </p>
      )}
    </div>
  );
}
